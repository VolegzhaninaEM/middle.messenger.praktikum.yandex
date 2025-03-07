import { Indexed } from "../types/types"

export function trim(value: string, symbol?: string) {
  if (symbol) {
    let regex = new RegExp(`[${symbol}]`, 'gi')
    return value.replace(regex, '')
  }

  return value.trim()
}

export function merge(lhs: Indexed, rhs: Indexed): Indexed {
  // Создаем стек для хранения пар объектов
  const stack: Array<[Indexed, Indexed]> = [[lhs, rhs]]

  while (stack.length > 0) {
    // Извлекаем последнюю пару объектов из стека
    const [left, right] = stack.pop()!

    for (let key in right) {
      if (!right.hasOwnProperty(key)) {
        continue
      }

      // Если значение свойства является объектом, добавляем его в стек
      if (isObject(right[key])) {
        stack.push([getOrCreate(left, key), right[key]])
      } else if (Array.isArray(right[key])) {
        left[key] = [...right[key]]; // Клонируем массив, чтобы избежать мутации
      } else {
        left[key] = right[key] // Просто копируем значение
      }
    }
  }

  return lhs
}

// Вспомогательная функция для проверки, является ли значение объектом
function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

// Вспомогательная функция для создания нового объекта, если его еще нет
function getOrCreate(obj: Indexed, key: string): Indexed {
  return (obj[key] = obj[key] || ({} as Indexed))
}

export function set(
  object: Indexed | unknown,
  path: string,
  value: unknown
): Indexed | unknown {
  // Код
  if (typeof path !== 'string') {
    throw new Error('path must be string')
  }

  if (object?.constructor !== Object) {
    return object
  }

  const result = path.split('.').reduceRight<Indexed>(
    (acc, key) => ({
      [key]: acc
    }),
    value as any
  )
  return merge(object as Indexed, result)
}

// Вспомогательные типы
type PlainObject<T = unknown> = { [k: string]: T }
type ArrayOrObject = [] | PlainObject

// Проверка на объект
function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

// Проверка на массив
function isArray(value: unknown): value is [] {
  return Array.isArray(value)
}

// Проверка на массив или объект
function isArrayOrObject(value: unknown): value is ArrayOrObject {
  return isPlainObject(value) || isArray(value)
}

// Функция глубокого сравнения
export function isEqual(lhs: unknown, rhs: unknown): boolean {
  // Сравнение примитивов
  if (!isArrayOrObject(lhs) || !isArrayOrObject(rhs)) {
    return lhs === rhs
  }

  // Проверка типа
  if (Array.isArray(lhs) !== Array.isArray(rhs)) return false

  // Сравнение массивов
  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    if (lhs.length !== rhs.length) return false
    return lhs.every((val, i) => isEqual(val, rhs[i]))
  }

  // Сравнение объектов
  const lhsKeys = Object.keys(lhs)
  const rhsKeys = Object.keys(rhs)

  if (lhsKeys.length !== rhsKeys.length) return false

  return lhsKeys.every(key => {
    const val1 = (lhs as PlainObject)[key]
    const val2 = (rhs as PlainObject)[key as keyof typeof rhs] // Явное приведение типа
    return isEqual(val1, val2)
  })
}

export function cloneDeep<T extends object = object>(obj: T): T {
  // Код здесь
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (isArray(obj)) {
    return obj.map(item => cloneDeep(item)) as T
  }

  if (isPlainObject(obj)) {
    const result: PlainObject = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        result[key] = cloneDeep(value as object)
      }
    }
    return result as T
  }

  return obj
}

function getKey(key: string, parentKey?: string) {
  return parentKey ? `${parentKey}[${key}]` : key
}

function getParams(data: PlainObject | [], parentKey?: string) {
  const result: [string, string][] = []

  for (const [key, value] of Object.entries(data)) {
    if (isArrayOrObject(value)) {
      result.push(...getParams(value, getKey(key, parentKey)))
    } else {
      result.push([getKey(key, parentKey), encodeURIComponent(String(value))])
    }
  }

  return result
}

export function queryString(data: PlainObject) {
  if (!isPlainObject(data)) {
    throw new Error('input must be an object')
  }

  return getParams(data)
    .map(arr => arr.join('='))
    .join('&')
}
