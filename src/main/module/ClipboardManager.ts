import { clipboard, NativeImage } from 'electron'

class ClipboardManager {
  // 写入文本
  writeText(text: string, type: 'clipboard' | 'selection' = 'clipboard'): void {
    clipboard.writeText(text, type)
  }

  // 读取文本
  readText(type: 'clipboard' | 'selection' = 'clipboard'): string {
    return clipboard.readText(type)
  }

  // 写入 HTML
  writeHTML(html: string, type: 'clipboard' | 'selection' = 'clipboard'): void {
    clipboard.writeHTML(html, type)
  }

  // 读取 HTML
  readHTML(type: 'clipboard' | 'selection' = 'clipboard'): string {
    return clipboard.readHTML(type)
  }

  // 写入图片
  writeImage(image: NativeImage, type: 'clipboard' | 'selection' = 'clipboard'): void {
    clipboard.writeImage(image, type)
  }

  // 读取图片
  static readImage(type: 'clipboard' | 'selection' = 'clipboard'): NativeImage {
    return clipboard.readImage(type)
  }

  // 写入 RTF
  writeRTF(rtf: string, type: 'clipboard' | 'selection' = 'clipboard'): void {
    clipboard.writeRTF(rtf, type)
  }

  // 读取 RTF
  readRTF(type: 'clipboard' | 'selection' = 'clipboard'): string {
    return clipboard.readRTF(type)
  }

  // 写入书签（macOS 和 Windows）
  writeBookmark(title: string, url: string, type: 'clipboard' | 'selection' = 'clipboard'): void {
    clipboard.writeBookmark(title, url, type)
  }

  // 读取书签
  readBookmark(): { title: string; url: string } {
    return clipboard.readBookmark()
  }

  // 清空剪贴板
  clear(type: 'clipboard' | 'selection' = 'clipboard'): void {
    clipboard.clear(type)
  }

  // 获取支持的格式
  availableFormats(type: 'clipboard' | 'selection' = 'clipboard'): string[] {
    return clipboard.availableFormats(type)
  }

  // 检查是否支持指定格式（实验性）
  has(format: string, type: 'clipboard' | 'selection' = 'clipboard'): boolean {
    return clipboard.has(format, type)
  }

  // 读取指定格式的内容（实验性）
  read(format: string): string {
    return clipboard.read(format)
  }

  // 读取指定格式的内容为 Buffer（实验性）
  readBuffer(format: string): Buffer {
    return clipboard.readBuffer(format)
  }

  // 写入指定格式的内容为 Buffer（实验性）
  writeBuffer(format: string, buffer: Buffer, type: 'clipboard' | 'selection' = 'clipboard'): void {
    clipboard.writeBuffer(format, buffer, type)
  }

  // 写入多种格式的数据
  write(
    data: {
      text?: string
      html?: string
      image?: NativeImage
      rtf?: string
      bookmark?: string
    },
    type: 'clipboard' | 'selection' = 'clipboard'
  ): void {
    clipboard.write(data, type)
  }
}

export default ClipboardManager
