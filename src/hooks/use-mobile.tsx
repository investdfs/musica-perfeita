
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Função para verificar o tipo de dispositivo
    const checkDevice = () => {
      // Verificamos o user-agent para dispositivos móveis
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      
      // Verificamos também o tamanho da tela
      const screenWidth = window.innerWidth < MOBILE_BREAKPOINT
      
      // Consideramos mobile se pelo menos um dos critérios for atendido
      return mobileRegex.test(userAgent.toLowerCase()) || screenWidth
    }
    
    const handleResize = () => {
      setIsMobile(checkDevice())
    }

    // Verificação inicial
    handleResize()
    
    // Adiciona listener para mudanças de tamanho
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return !!isMobile
}

// Função para verificar dispositivo pelo lado do servidor ou durante o primeiro render
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  return mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth < MOBILE_BREAKPOINT
}
