import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[0]).toBe('initial-value')
  })

  it('returns stored value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('"stored-value"')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[0]).toBe('stored-value')
  })

  it('sets value in localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"')
    expect(result.current[0]).toBe('new-value')
  })

  it('handles function updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '1')
    expect(result.current[0]).toBe(1)
  })

  it('clears value from localStorage when clearValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    act(() => {
      result.current[2].clearValue()
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key')
    expect(result.current[0]).toBe('initial-value')
  })

  it('checks if value exists in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('"some-value"')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[2].hasValue()).toBe(true)
  })

  it('returns false when value does not exist in localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[2].hasValue()).toBe(false)
  })

  it('gets current value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('"current-value"')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[2].getValue()).toBe('current-value')
  })

  it('handles JSON parse errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[0]).toBe('initial-value')
  })

  it('handles localStorage setItem errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    // Should not throw error
    expect(() => {
      act(() => {
        result.current[1]('new-value')
      })
    }).not.toThrow()
  })

  it('handles localStorage getItem errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error')
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    expect(result.current[0]).toBe('initial-value')
  })

  it('syncs with storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    // Simulate storage event from another tab
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: '"updated-value"',
        oldValue: null,
        storageArea: localStorage,
      })
      window.dispatchEvent(storageEvent)
    })

    expect(result.current[0]).toBe('updated-value')
  })

  it('ignores storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    // Simulate storage event for different key
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'different-key',
        newValue: '"different-value"',
        oldValue: null,
        storageArea: localStorage,
      })
      window.dispatchEvent(storageEvent)
    })

    expect(result.current[0]).toBe('initial-value')
  })

  it('handles null newValue in storage event', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))

    // Simulate storage event with null value
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: null,
        oldValue: '"old-value"',
        storageArea: localStorage,
      })
      window.dispatchEvent(storageEvent)
    })

    // Should not update the value
    expect(result.current[0]).toBe('initial-value')
  })

  it('works with complex objects', () => {
    const complexObject = { name: 'John', age: 30, hobbies: ['reading', 'gaming'] }
    
    const { result } = renderHook(() => useLocalStorage('test-key', complexObject))

    act(() => {
      result.current[1]({ ...complexObject, age: 31 })
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '{"name":"John","age":31,"hobbies":["reading","gaming"]}')
    expect(result.current[0]).toEqual({ name: 'John', age: 31, hobbies: ['reading', 'gaming'] })
  })
})
