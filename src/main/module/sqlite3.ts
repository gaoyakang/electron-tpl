import * as fs from 'fs'
import * as path from 'path'
import Database from 'better-sqlite3'
import { config } from './config'
export type SqlValue = string | number | boolean | null | Buffer
export type RowObject = Record<string, SqlValue>

export class BetterSqliteWrapper {
  private db: Database.Database | null = null
  private dbPath: string
  private static _ins?: BetterSqliteWrapper

  constructor(dbPath: string) {
    this.dbPath = path.resolve(dbPath)
  }

  /** 公有初始化入口，只能调一次 */
  public static init(dbPath: string): void {
    if (this._ins) throw new Error('DB already initialized')
    this._ins = new BetterSqliteWrapper(dbPath)
    this._ins.openDB()
  }

  /** 公有读取入口 */
  public static get ins(): BetterSqliteWrapper {
    if (!this._ins) throw new Error('DB not initialized')
    return this._ins
  }

  // 初始化所有表:初始表结构需要在此处定义，下面是示例
  public initTables(): void {
    config.dev.db.initialTables.forEach((ddl) => {
      this.createTable(ddl)
    })
  }
  /* ========== 1. 数据库层面 ========== */

  /** 新建（或打开）数据库 */
  openDB(): void {
    if (this.db) return
    // 自动建目录
    const dir = path.dirname(this.dbPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    this.db = new Database(this.dbPath)
    // 性能优化，可按需调整
    this.db.pragma('journal_mode = WAL')
  }

  /** 关闭并删除数据库文件 */
  deleteDB(): void {
    this.close()
    if (fs.existsSync(this.dbPath)) fs.unlinkSync(this.dbPath)
  }

  /** 关闭连接 */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  /* ========== 2. 表层面 ========== */

  /**
   * 建表
   * @param ddl 完整建表语句，例如：
   *   CREATE TABLE IF NOT EXISTS user(
   *     id   INTEGER PRIMARY KEY AUTOINCREMENT,
   *     name TEXT    NOT NULL,
   *     age  INT     DEFAULT 18
   *   );
   */
  createTable(ddl: string): void {
    this.ensureDb().exec(ddl)
  }

  /** 删表 */
  dropTable(tableName: string): void {
    this.ensureDb().exec(`DROP TABLE IF EXISTS "${tableName}"`)
  }

  /* ========== 3. 数据层面 ========== */

  /** 增 */
  insert(table: string, data: RowObject): number {
    const keys = Object.keys(data)
    const vals = Object.values(data)
    const ph = keys.map(() => '?').join(',')
    const sql = `INSERT INTO "${table}" (${keys.join(',')}) VALUES (${ph})`
    const stmt = this.ensureDb().prepare(sql)
    return stmt.run(...vals).lastInsertRowid as number
  }

  /** 删 */
  delete(table: string, whereSql: string, whereParams: SqlValue[] = []): number {
    const sql = `DELETE FROM "${table}" WHERE ${whereSql}`
    const stmt = this.ensureDb().prepare(sql)
    return stmt.run(...whereParams).changes
  }

  /** 改 */
  update(
    table: string,
    setData: RowObject,
    whereSql: string,
    whereParams: SqlValue[] = []
  ): number {
    const setKeys = Object.keys(setData)
    const setVals = Object.values(setData)
    const setFrag = setKeys.map((k) => `"${k}" = ?`).join(',')
    const sql = `UPDATE "${table}" SET ${setFrag} WHERE ${whereSql}`
    const stmt = this.ensureDb().prepare(sql)
    return stmt.run(...setVals, ...whereParams).changes
  }

  /** 查（返回数组） */
  select(
    table: string,
    whereSql = '1=1',
    whereParams: SqlValue[] = [],
    columns = '*'
  ): RowObject[] {
    const sql = `SELECT ${columns} FROM "${table}" WHERE ${whereSql}`
    const stmt = this.ensureDb().prepare(sql)
    return stmt.all(...whereParams) as RowObject[]
  }

  /** 查单条 */
  selectOne(
    table: string,
    whereSql = '1=1',
    whereParams: SqlValue[] = [],
    columns = '*'
  ): RowObject | undefined {
    const sql = `SELECT ${columns} FROM "${table}" WHERE ${whereSql} LIMIT 1`
    const stmt = this.ensureDb().prepare(sql)
    return stmt.get(...whereParams) as RowObject | undefined
  }

  /* ========== 内部 ========== */
  private ensureDb(): Database.Database {
    if (!this.db) throw new Error('Database not opened. Call open() first.')
    return this.db
  }
}
