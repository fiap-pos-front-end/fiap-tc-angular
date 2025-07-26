import { Component, input, output, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { UploaderComponent } from '../../uploader/uploader.component';
import { UploaderService } from '@fiap-tc-angular/infrastructure';
import { Transaction, TransactionDTO } from '@fiap-pos-front-end/fiap-tc-shared';

@Component({
  selector: 'app-dialog-uploader',
  imports: [Dialog, Button, ConfirmDialogModule, UploaderComponent],
  templateUrl: './dialog-uploader.component.html',
})
export class DialogUploaderComponent {
  readonly isVisible = input.required<boolean>();
  readonly transaction = input<{}>();
  readonly onHide = output<void>();
  private readonly uploaderService = inject(UploaderService);

  archives: File[] = [];

  async saveTransaction() {
    if (this.archives.length == 0) {
      this.onHide.emit();
    } else {
      this.uploaderService.uploadAttachments(1, this.archives).subscribe({
        next: (res) => {
          console.log('🚀 ~ DialogUploaderComponent ~ saveTransaction ~ res:', res);
        },
        error: (error) => {
          console.log('🚀 ~ DialogUploaderComponent ~ saveTransaction ~ error:', error);
        },
      });
    }
  }

  storeFiles(event: FileList) {
    this.archives = Array.from(event);
  }
}
