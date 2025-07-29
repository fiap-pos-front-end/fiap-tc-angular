import { Component, input, output, inject, DestroyRef } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { UploaderComponent } from '../../uploader/uploader.component';
import { UploaderService } from '@fiap-tc-angular/infrastructure';
import { Transaction } from '@fiap-pos-front-end/fiap-tc-shared';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dialog-uploader',
  imports: [Dialog, Button, ConfirmDialogModule, UploaderComponent, ProgressSpinnerModule],
  templateUrl: './dialog-uploader.component.html',
})
export class DialogUploaderComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly isVisible = input.required<boolean>();
  readonly transaction = input<Transaction | undefined>(undefined);
  readonly onHide = output<void>();
  readonly onSave = output<boolean>();
  private readonly uploaderService = inject(UploaderService);

  archives: File[] = [];
  loading: boolean = false;

  async saveTransaction() {
    this.loading = true;
    this.uploaderService
      .uploadAttachments(this.transaction()!.id, this.archives)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.onSave.emit(this.archives.length > 0 ? true : false);
        this.loading = false;
      });
  }

  storeFiles(event: FileList) {
    this.archives = Array.from(event);
  }
}
