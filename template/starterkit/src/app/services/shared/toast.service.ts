import { Injectable } from '@angular/core';
import { ComponentFactoryResolver, Injector } from '@angular/core';
import { ToastComponent } from '../../components/shared/toast/toast.component';
import { ApplicationRef } from '@angular/core';
import { ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  show(message: string, type: 'success' | 'error' | 'warning', duration: number = 3000) {
    // Cria o componente dinamicamente
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(ToastComponent)
      .create(this.injector);

    // Atribui os valores ao componente
    componentRef.instance.message = message;
    componentRef.instance.type = type;

    // Adiciona o componente à aplicação
    this.appRef.attachView(componentRef.hostView);

    // Cria um contêiner de DOM para o componente
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;

    // Adiciona o componente ao body
    document.body.appendChild(domElem);

    // Remove o toast depois de 'duration' milissegundos
    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      domElem.remove();
    }, duration);
  }
}
