import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentRegistryService {
  
  private componentMap = new Map<string, Type<any>>(); // Map of component types to their classes

  constructor() { }

  /**
   * Register a component with the registry
   * @param type The component type identifier (e.g., 'dropdown', 'checkbox', etc.)
   * @param component The component class
   */
  register(type: string, component: Type<any>): void {
    this.componentMap.set(type, component);
  }

  /**
   * Get a component by its type
   * @param type The component type identifier
   * @returns The component class or undefined if not found
   */
  getComponent(type: string): Type<any> | undefined {
    return this.componentMap.get(type);
  }

  /**
   * Check if a component type is registered
   * @param type The component type identifier
   * @returns True if registered, false otherwise
   */
  hasComponent(type: string): boolean {
    return this.componentMap.has(type);
  }

  /**
   * Get all registered component types
   * @returns Array of registered component type identifiers
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.componentMap.keys());
  }
}