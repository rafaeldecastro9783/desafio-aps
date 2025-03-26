export function validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
  
    if (cnpj.length !== 14) return false;
  
    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false;
  
    const calc = (x: number[]) => {
      let i = x.length - 7, n = 0;
      for (let j = 0; j < x.length; j++)
        n += x[j] * i--, i = i < 2 ? 9 : i;
      return n % 11 < 2 ? 0 : 11 - n % 11;
    };
  
    const num = cnpj.split('').map(Number);
    const dig1 = calc(num.slice(0, 12));
    const dig2 = calc(num.slice(0, 13));
  
    return dig1 === num[12] && dig2 === num[13];
  }
  