import { MatPaginatorIntl } from '@angular/material/paginator';

const hunRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 a ${length}-ból/ből`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} a ${length}-ból/ből`;
}


export function getHunPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'Oldalankénti adatok:';
  paginatorIntl.nextPageLabel = 'Következő oldal';
  paginatorIntl.previousPageLabel = 'Előző oldal';
  paginatorIntl.getRangeLabel = hunRangeLabel;
  
  return paginatorIntl;
}