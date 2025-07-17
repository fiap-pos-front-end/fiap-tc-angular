import { Component, input, output,  } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { UploaderComponent } from '../../uploader/uploader.component'

@Component({
  selector: 'app-dialog-uploader',
  imports: [
    Dialog,
    Button,
    ConfirmDialogModule,
    UploaderComponent
  ],
  templateUrl: './dialog-uploader.component.html',
})
export class DialogUploaderComponent {
  readonly isVisible = input.required<boolean>();
  readonly onHide = output<void>();

  constructor() {}

}
