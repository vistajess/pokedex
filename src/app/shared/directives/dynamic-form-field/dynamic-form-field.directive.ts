import { ComponentRef, Directive, Input, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentRegistryService } from '../../services/component-registry.service';

export interface DynamicFieldConfig {
  name: string;
  type: string; // This will be used to look up the component in the registry
  label: string;
  initialValue?: any;
  options?: any[];
}

@Directive({
  selector: '[appDynamicFormField]'
})
export class DynamicFormFieldDirective implements OnDestroy {

  @Input()
  get config() { return this._config; }
  set config(value: DynamicFieldConfig | null) {
    if (value) {
      this._config = value;
    }
  }
  private _config: DynamicFieldConfig | null = null;

  @Input()
  get control() { return this._control; }
  set control(control: FormControl | null) {
    this._control = control;
    if (control) {
      this.renderComponent();
    }
  }
  private _control: FormControl | null = null;

  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentRegistry: ComponentRegistryService
  ) { }

  get instance() {
    return this.componentRef?.instance;
  }

  renderComponent(): void {
    // Clear previous component if it exists
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    // Look up component from registry by type
    const componentType = this.componentRegistry.getComponent(this._config!.type);

    if (!componentType) {
      console.warn(`Component type "${this._config!.type}" not found`);
      return;
    }

    // Create component
    this.componentRef = this.viewContainerRef.createComponent(componentType);

    // Set component properties
    const instance = this.componentRef.instance;
    instance.label = this._config!.label;

    if (this._config!.options) {
      instance.options = this._config!.options;
    }

    if (this._control) {
      instance.formControl = this._control;
      instance.writeValue(this._control!.value);
      instance.registerOnChange((value: any) => this._control!.setValue(value));
      instance.registerOnTouched(() => this._control!.markAsTouched());
    }
    this.componentRef.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}