import { Injectable } from '@angular/core';
  
import { ToastrService } from 'ngx-toastr';
  
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private toastr: ToastrService) { }
  
  // tslint:disable-next-line:typedef
  showSuccess(message, title){
      this.toastr.success(message, title);
  }
  
  // tslint:disable-next-line:typedef
  showError(message, title){
      this.toastr.error(message, title);
  }

  // tslint:disable-next-line:typedef
  showInfo(message, title){
      this.toastr.info(message, title);
  }
  
  // tslint:disable-next-line:typedef
  showWarning(message, title){
      this.toastr.warning(message, title);
  }
  
}
