import { create } from 'zustand'

type CounterState = {
  count: number
  setCount: (value: number | ((prev: number) => number)) => void
  getCount: () => number
}

export const useCounterStore = create<CounterState>()((set, get) => ({
  count: 0,

  // 设置 count，支持直接值或函数回调
  setCount: (value) =>
    set((state) => ({
      count: typeof value === 'function' ? value(state.count) : value
    })),

  // 返回当前 count
  getCount: () => get().count
}))
