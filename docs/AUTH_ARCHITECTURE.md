# Focus Sanctuary — Guía de Arquitectura de Autenticación y Sistema de Diseño

Un desglose arquitectónico integral de los módulos de autenticación (`LoginPageComponent` y `RegisterPageComponent`), explicando las decisiones técnicas, los patrones del sistema de diseño (Material Design 3 + Bento Grid estilo Linear/Vercel), las transiciones nativas del navegador con View Transitions y Shared Elements, y la orquestación de micro-interacciones con GSAP calibradas para fluidez a 120Hz.

---

## 1. Fundamentos Arquitectónicos (Conceptos > Código)

### 1.1 Arquitectura de Componentes Modernos en Angular 19
Ambos componentes de autenticación (`LoginPageComponent` y `RegisterPageComponent`) están diseñados siguiendo las mejores prácticas de Angular 19:
- **Componentes Standalone (`standalone: true`)**: Eliminan la intermediación obsoleta de los `NgModule`, permitiendo árboles de dependencias directos, *tree-shaking* agresivo y división de fragmentos (*chunk splitting*) en carga perezosa (`login-page-component: ~11.8 kB`, `register-page-component: ~13.9 kB`).
- **Inyección de Dependencias Basada en Funciones (`inject()`)**: Reemplaza las largas listas de parámetros en el constructor por llamadas directas, mejorando la inferencia de tipos y la legibilidad:
  ```typescript
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  ```
- **Formularios Reactivos con Validación Precisa**:
  - `loginForm`: `email` (Requerido + Email válido), `password` (Requerido).
  - `registerForm`: `nombres`, `apellidos`, `email`, y contraseña con validación estricta mediante expresión regular (`Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!]).{8,}$')`).
- **Cero Dependencia de Librerías de Iconos Externas**:
  Uso exclusivo de la fuente oficial **Google Font Icons** (`material-symbols-rounded`). Gracias a sus ejes de fuente variable (`FILL`, `wght`, `GRAD`, `opsz`), no se requiere sobrecargar la aplicación con pesadas librerías de SVG o paquetes de terceros.

---

## 2. Sistema de Diseño: Material Design 3 Expressive + Bento Grid Estilo Linear / Vercel

La interfaz fusiona tres corrientes de diseño contemporáneas en una experiencia visual equilibrada:

| Dimensión de Diseño | Linear / Vercel SaaS | Material Design 3 Expressive | Focus Sanctuary (Identidad Zen) |
| :--- | :--- | :--- | :--- |
| **Topología de Layout** | Tarjetas asimétricas estilo Bento Grid | Paneles canónicos adaptativos | Diseño dividido 50/50 con efecto espejo |
| **Superficies y Bordes** | Bordes finos (`border-stone-200/80`), `shadow-2xs` | Niveles tonales de contenedor, esquinas amplias | Desenfoque esmerilado (`backdrop-blur-md`), lienzo crema `#FDFCF9` |
| **Tipografía** | Espaciado cerrado (`tracking-tight`), alto contraste | Escala expresiva de títulos, etiquetas de apoyo | Inter / Sans-serif con amplio espacio en blanco |
| **Acento Primario** | Monocromático oscuro / grafito profundo | Acento dinámico de sistema | Verde Musgo (`#3A4D39`) + tonos pétreos neutros |

### 2.1 Composición en Espejo con Bento Grid
- **Login**:
  - Izquierda: Panel interactivo del formulario.
  - Derecha: Marco multimedia Bento (`zen-sanctuary-art.jpg` con degradado ambiental y tarjeta flotante de reflexión).
- **Registro (Invertido)**:
  - Izquierda: Marco multimedia Bento (desplazado a la izquierda).
  - Derecha: Panel interactivo del formulario (desplazado a la derecha).
- **Por qué funciona**: En pantallas de escritorio, el ojo humano procesa el contraste de izquierda a derecha. Al invertir la distribución espacial entre el Login y el Registro, el usuario recibe un estímulo visual inmediato de cambio de contexto sin perder la coherencia estética.

### 2.2 Campos de Texto Expressive de Material Design 3
A diferencia de los inputs estándar genéricos, estos campos incorporan:
1. **Geometría Redondeada y Ergonómica**: `rounded-2xl` (16px de radio de borde), que aporta suavidad visual y modernidad.
2. **Iconos Guía Integrados**: `mail`, `lock`, `person`, `badge` en tono `text-stone-400` con tamaño óptico de 22px.
3. **Estados Armonizados**: Transiciones de enfoque fluidas mediante `ring-2 ring-zen-accent/20` y `border-zen-accent`.

### 2.3 Alternativa 2: Indicador de Advertencia Final y Micro-Tooltips sin Desplazamiento (Zero CLS)
Los formularios tradicionales colocan etiquetas `<p>` de error debajo de cada input. Cada vez que aparece o desaparece un mensaje, el contenido adyacente sufre un empuje vertical (**Cumulative Layout Shift** o **CLS**), lo cual degrada la percepción de fluidez a 60fps/120Hz.

**Cómo resuelve el problema la Alternativa 2**:
1. **Contenedor con Altura Constante**: La altura de cada campo es fija (`h-[46px]` o `py-3`).
2. **Icono Indicador Final**: Un icono pulsante de advertencia (`error`) integrado a la derecha del input.
3. **Micro-Tooltip Oscuro Flotante**:
   - Renderizado con posicionamiento absoluto superior (`absolute right-0 -top-8 z-30`).
   - Se muestra ante el evento hover (`group-hover/tooltip:opacity-100`) o cuando el campo tiene el foco activo (`group-focus-within/field:opacity-100`).
   - Fondo en tono piedra oscuro (`bg-stone-900 text-stone-100`), micro-flecha indicadora y punto en rosa cálido.
   - Resultado: **0 píxeles de desplazamiento de interfaz**, retroalimentación visual clara y nula fricción cognitiva.

---

## 3. View Transitions API y Transiciones de Elementos Compartidos (Shared Elements)

Al navegar entre `/login` y `/register`, una Single Page Application convencional reemplazaría el DOM de forma abrupta o mostraría un parpadeo en blanco.

Implementamos la **View Transitions API** nativa del navegador combinada con **Shared Element Transitions**:

```
+--------------------------------------------------------------------------+
| Capa del Compositor GPU del Navegador durante la Navegación              |
|                                                                          |
|   ::view-transition                                                      |
|   ├── ::view-transition-group(root)                                      |
|   ├── ::view-transition-group(vt-brand)   <-- Transformación del Logo    |
|   ├── ::view-transition-group(vt-form)    <-- Deslizamiento Izq <-> Der  |
|   ├── ::view-transition-group(vt-media)   <-- Marco Bento Izq <-> Der    |
|   └── ::view-transition-group(vt-footer)  <-- Línea Base Persistente     |
+--------------------------------------------------------------------------+
```

### 3.1 Identificadores de Elementos Compartidos en el Marcado
En `login-page.component.html` y `register-page.component.html`:
- `.vt-brand`: El isotipo y el título superior realizan un morph suave.
- `.vt-form`: El panel del formulario interpola su posición horizontalmente.
- `.vt-media`: El marco multimedia Bento y la tarjeta de cita flotante cruzan la pantalla de forma fluida.
- `.vt-footer`: Permanece firme como base de descanso visual.

### 3.2 Curva de Tiempo de Animación a 120Hz (ProMotion) y 60fps
Configuración en `src/styles.css`:
```css
::view-transition-group(vt-media),
::view-transition-group(vt-form) {
  animation-duration: 380ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  contain: layout paint;
  will-change: transform;
  isolation: isolate;
  backface-visibility: hidden;
  transform: translateZ(0);
}
```

#### ¿Por qué `cubic-bezier(0.16, 1, 0.3, 1)`?
Es la curva de desaceleración tipo resorte utilizada en pantallas ProMotion (120Hz) y en las transiciones de ventanas de macOS/iOS. El movimiento inicia con alta velocidad en los primeros 80ms y desacelera suavemente en los últimos 300ms sin frenadas bruscas ni rebotes excesivos, imitando la respuesta del ojo humano.

#### Aceleración por Hardware y Aislamiento de Capas:
- `contain: layout paint`: Informa al motor de renderizado que las mutaciones internas de este contenedor no afectan la geometría del resto de la página.
- `transform: translateZ(0)` y `will-change: transform`: Promueven el contenedor a su propia capa de composición en la GPU, evitando recalcular el renderizado en la CPU principal durante el traslado.

---

## 4. Orquestación con GSAP y la Arquitectura de Movimiento en Dos Niveles

Un error frecuente en el desarrollo frontend es intentar usar una librería JavaScript de animación (como GSAP) para competir con las transiciones de ruta del navegador.

Diseñamos una **Arquitectura de Movimiento en Dos Niveles**:

```
+--------------------------------------------------------------------------+
| FLUJO DE MOVIMIENTO EN DOS NIVELES                                       |
|                                                                          |
| Nivel 1: Movimiento Macro (0ms - 380ms)                                  |
| -> Ejecutado en el hilo de la GPU mediante View Transitions API nativa   |
| -> Traslada los contenedores del Bento Grid y el formulario en pantalla  |
|                                                                          |
| [Punto de Sincronización: delay 380ms - Finaliza la transición GPU]      |
|                                                                          |
| Nivel 2: Movimiento Micro (380ms en adelante)                            |
| -> Ejecutado en el hilo principal mediante contexto GSAP                 |
| -> Entrada en cascada de inputs, botones y chips (.anim-stagger)          |
| -> Física ambiental continua en la tarjeta de cita (repeat: -1, yoyo)     |
+--------------------------------------------------------------------------+
```

### 4.1 Retardo Sincronizado (`delay: 0.38`)
En `login-page.component.ts` y `register-page.component.ts`:
```typescript
private initEntranceAnimations() {
  const ctx = gsap.context(() => {
    // Los elementos internos entran DESPUÉS de que concluye la transición GPU de 380ms
    gsap.from('.anim-stagger', {
      opacity: 0,
      y: 10,
      duration: 0.35,
      stagger: 0.03,
      delay: 0.38,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // Movimiento ambiental de respiración para la tarjeta de cita flotante
    if (this.quoteCard?.nativeElement) {
      gsap.to(this.quoteCard.nativeElement, {
        y: -6,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  });
}
```

Si GSAP se ejecutara de forma inmediata al instanciarse el componente (`delay: 0`), la GPU y el motor de JavaScript competirían por los mismos recursos, generando pérdidas de fotogramas (*jank*) tanto a 60Hz como a 120Hz. Al sincronizar el inicio a los `0.38s`, la escena se posiciona primero y de inmediato se despliegan los elementos internos en cascada.

---

## 5. Lista de Verificación de Calidad Arquitectónica

- [x] **Cero Desplazamiento Acumulativo de Diseño (Zero CLS)**: Los mensajes de error flotan fuera del flujo del documento.
- [x] **Transición Fluida a 120Hz entre Pantallas**: Shared Element Transitions nativas interpolan la posición de ambas columnas.
- [x] **Sin Acoplamiento a Librerías de Iconos Externas**: Integración directa con fuentes variables de Google Icons.
- [x] **Formularios Accesibles y Robustos**: Formularios reactivos tipados con estados de carga e inhabilitación.
- [x] **Arquitectura Angular Limpia**: Componentes standalone, inyección de dependencias funcional y separación ordenada de estilos.
