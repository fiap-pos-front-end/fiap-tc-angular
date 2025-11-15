import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DataViewModule } from 'primeng/dataview';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';

export const PRIMENG_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  ButtonModule,
  Checkbox,
  ConfirmPopupModule,
  DataViewModule,
  Select,
  Message,
  TableModule,
  Tag,
  Toast,
  ConfirmDialogModule,
];
