import { Component, input, output, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { UploaderComponent } from '../../uploader/uploader.component';
import { UploaderService } from '@fiap-tc-angular/infrastructure';

@Component({
  selector: 'app-dialog-uploader',
  imports: [Dialog, Button, ConfirmDialogModule, UploaderComponent],
  templateUrl: './dialog-uploader.component.html',
})
export class DialogUploaderComponent {
  readonly isVisible = input.required<boolean>();
  readonly transaction = input<{}>(); //Para salvar/deletar na API
  readonly onHide = output<void>();
  private readonly uploaderService = inject(UploaderService);

  archives: object[] = [];

  async saveTransaction() {
    if (this.archives.length == 0) {
      console.log(this.transaction());
      this.onHide.emit();
    } else {
      //Deletando todos anexos já existentes -> passar nome dos arquivos
      //await this.deleteFile(this.archives);
      //Fazendo Upload dos novos
      await this.saveFiles();
    }
  }

  async saveFiles(): Promise<string[] | null> {
    try {
      const urls: string[] = [];
      for (const file of this.archives) {
        const fileOriginal = (file as { original: File }).original;
        const url = await this.uploaderService.uploadPublicFile(fileOriginal);
        urls.push(url);
      }
      console.log('URLs:', urls);
      return urls;
    } catch (error) {
      console.error('Erro no upload:', error);
      return null;
    }
  }

  async deleteFile(files: []): Promise<void> {
    try {
      for (const file of files) {
        await this.uploaderService.deletePublicFile(file);
        console.log('Arquivo deletado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  }

  storeFiles(event: FileList) {
    this.archives = Array.from(event);
  }
}
