import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberFormat',
  standalone: false,
 })
export class NumberFormatPipe implements PipeTransform {
  transform(
    value: number,
    digitsInfo: string = '1.2-2',
    locale: string = 'en-US'
  ): string | null {
    if (value == null) return null;
    const [intPart, fracPart] = digitsInfo.split('.');
    const [minFrac, maxFrac] = (fracPart || '0-0').split('-').map(Number);
    return new Intl.NumberFormat(locale, {
      minimumIntegerDigits: +intPart,
      minimumFractionDigits: minFrac,
      maximumFractionDigits: maxFrac,
    }).format(value);
  }
}
