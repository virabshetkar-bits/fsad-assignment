import { Pipe, PipeTransform } from '@angular/core';
import { AutoCompleteData } from '../models';

@Pipe({
  name: 'joinStrings',
  standalone: true,
})
export class JoinStringsPipe implements PipeTransform {
  transform(value: AutoCompleteData[], ...args: unknown[]): unknown {
    return value.map((d) => d.name).join(', ');
  }
}
