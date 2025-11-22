// sqlite数据库操作封装
export const db = {
  insert: (table: string, data: Record<string, any>) =>
    window.api.db({ type: 'insert', table, data }) as Promise<number>,

  delete: (table: string, whereSql: string, whereParams?: any[]) =>
    window.api.db({ type: 'delete', table, whereSql, whereParams }) as Promise<number>,

  update: (table: string, setData: Record<string, any>, whereSql: string, whereParams?: any[]) =>
    window.api.db({ type: 'update', table, setData, whereSql, whereParams }) as Promise<number>,

  select: (table: string, whereSql?: string, whereParams?: any[], columns?: string) =>
    window.api.db({ type: 'select', table, whereSql, whereParams, columns }) as Promise<
      Record<string, any>[]
    >,

  selectOne: (table: string, whereSql?: string, whereParams?: any[], columns?: string) =>
    window.api.db({ type: 'selectOne', table, whereSql, whereParams, columns }) as Promise<
      Record<string, any> | undefined
    >
}
