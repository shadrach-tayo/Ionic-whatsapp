import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(date, format) {
    return moment(date).format(format);
  }
}
