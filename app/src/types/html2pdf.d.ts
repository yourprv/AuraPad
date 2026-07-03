declare module 'html2pdf.js' {
  interface Options {
    margin?: number | number[]
    filename?: string
    image?: {
      type?: string
      quality?: number
    }
    html2canvas?: {
      scale?: number
    }
    jsPDF?: {
      orientation?: 'portrait' | 'landscape'
      unit?: 'mm' | 'cm' | 'in' | 'px' | 'pt' | 'ex' | 'em' | 'pc'
      format?: string
      compress?: boolean
    }
  }

  interface Html2Pdf {
    set(options: Options): Html2Pdf
    from(element: HTMLElement | string): Html2Pdf
    save(): void
    output(type: string): any
    then(callback: (result: any) => void): Html2Pdf
  }

  function html2pdf(): Html2Pdf
  function html2pdf(element: HTMLElement | string, options?: Options): void

  export default html2pdf
}
