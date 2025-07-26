import { Component, input, output, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { UploaderComponent } from '../../uploader/uploader.component';
import { UploaderService } from '@fiap-tc-angular/infrastructure';
import { Transaction } from '@fiap-pos-front-end/fiap-tc-shared';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-dialog-uploader',
  imports: [Dialog, Button, ConfirmDialogModule, UploaderComponent, ProgressSpinnerModule],
  templateUrl: './dialog-uploader.component.html',
})
export class DialogUploaderComponent {
  readonly isVisible = input.required<boolean>();
  readonly transaction = input<Transaction | undefined>(undefined);
  readonly onHide = output<void>();
  readonly onSave = output<boolean>();
  private readonly uploaderService = inject(UploaderService);

  archives: File[] = [];
  loading: boolean = false;

  async saveTransaction() {
    if (this.archives.length == 0) {
      this.onHide.emit();
    } else {
      this.loading = true;
      const id = parseInt(this.transaction()!.id);
      this.uploaderService.uploadAttachments(id, this.archives).subscribe({
        next: () => {
          this.onSave.emit(true);
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  storeFiles(event: FileList) {
    this.archives = Array.from(event);
  }
}
