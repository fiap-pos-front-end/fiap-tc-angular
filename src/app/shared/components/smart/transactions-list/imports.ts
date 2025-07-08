import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Chip } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DataViewModule } from 'primeng/dataview';
import { Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { Steps } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';

export const PRIMENG_MODULES = [
  FormsModule,
  HttpClientModule, // TODO: Remover
  ReactiveFormsModule,
  BadgeModule,
  ButtonModule,
  Checkbox,
  Chip,
  ConfirmDialogModule,
  ConfirmPopupModule,
  DataViewModule,
  Dialog,
  Select,
  FileUpload,
  Message,
  Steps,
  TableModule,
  Tag,
  Toast,
];
