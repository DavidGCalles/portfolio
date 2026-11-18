---
title: "Por qué Alembic salió del repo (la historia del ADR-011)"
description: "Un pin de Alembic que nunca estuvo montado, un arranque limpio que reventaba y una regla: el esquema solo crece. La historia del ADR-011 de coreAI, en formato conversación."
pubDate: 2026-11-18
tags: [coreAI, postgres, ingeniería]
draft: false
---

coreAI se despliega como stack de memoria IA en proyectos de terceros. Este es el relato de por qué su base de datos no usa migraciones, contado como se contó.

Intentaba encontrar una voz para el blog y no la encontraba. Porque creo que lo que busco son conversaciones. Este post explora esa posibilidad, ¡y me ha gustado!

## **El primer despliegue real de un cliente muere con `UndefinedTableError`. ¿Qué pasó?**

Fue un momento de realización: aquí hay algo muy roto, muy profundo, y además no lo esperaba. Había estado trabajando durante días, si no semanas, en un modelo de datos estable que no había requerido modificaciones.

Eso, unido a que la documentación del proyecto mencionaba Alembic y yo hubiera jurado haber ejecutado el setup inicial, me llevó a la conclusión obvia: estado desincronizado por falta de migraciones.

## **Fuiste a buscar las migraciones. ¿Qué encontraste?**

Efecto Mandela en todo su esplendor. Rebusqué el historial de git hasta el fondo y, por mucho que no encontraba los commits, seguía jurándome que eso había ocurrido. Pero las pruebas son las pruebas: Alembic solo estaba planeado.

Además, su existencia planteaba otras dudas para su despliegue como stack independiente de memoria IA en otros proyectos, dudas que no había tenido en cuenta debido a su falta real de implementación.

## **El camino obvio era montar Alembic de verdad. ¿Cuándo supiste que no?**

Con la aparición de los primeros clientes de coreAI se estableció el patrón de despliegue por compose a través del tag `include`. Verificando los procesos de despliegue, combinados con los de Alembic, la perspectiva era clara: si el plug and play de coreAI era una prioridad para generar más desarrollos sobre él, había que prescindir de Alembic, porque obligaba a un setup mucho menos automatizado.

Es una decisión relativamente cuestionable a escala industrial, y no usar un sistema de versionado de la base de datos me parecería mala práctica en un entorno de equipo o corporativo. Es por eso que, aunque ahora mismo la fuente de la verdad está en los modelos y en un script de bootstrapping de las tablas, con sus inconvenientes como todo, sigo explorando opciones para establecer un versionado de base de datos más robusto.

## **Sin migraciones, ¿qué evita que alguien toque la base de datos "a lo loco"?**

La disciplina, principalmente. Es por lo que he mencionado que en un entorno corporativo o de equipo me parecería una mala idea: hoy en coreAI solo me rindo cuentas a mí mismo y a mi disciplina. Es parte de la propia documentación del proyecto ciertos patrones de modificación de la base de datos para reducir los riesgos del camino que se ha tomado.

Pero al final, en mi opinión, la disciplina es inherente a cualquier tipo de control de versiones: sea código como git, Alembic para la base de datos o bootstrapping como se está usando en coreAI. Sin una disciplina y un proceso, la utilidad de todas queda en entredicho.

## **¿Cómo funciona ese bootstrap en la práctica?**

Cuando los servicios que consumen la base de datos arrancan, lanzan una comprobación. Intentan crear las tablas: si existen, esos comandos no actúan. Intentan crear las columnas: si existen, no modifican nada; si no existen, se crean con defaults.

Ese mecanismo, que puede parecer peligrosamente simple, es muy sólido si se sigue la regla ya determinada en el repositorio: solo cambios aditivos. ¿Por qué? Porque los clientes ya están funcionando sobre esas tablas. Un bump del submodule de git de coreAI no puede suponerles la destrucción de sus datos ya guardados. Un cliente debe poder aprovecharse de una nueva feature de coreAI sin tirar a la basura su base de datos.

## **¿Te ha mordido ya? ¿Qué es lo que te quita el sueño?**

No, la verdad es que no. Pero espero que me cause problemas serios con los enums si se necesita una modificación en algún momento.

*El [ADR completo](https://github.com/DavidGCalles/coreAI/blob/main/docs/adr/011-esquema-aditivo-bootstrap-idempotente.md), con los pros y contras y las trampas de Postgres que sí absorbió la implementación, está en el repo. Si montas un stack sobre el de otro, míralo antes de decidir cómo versiona tu esquema.*

**La historia en el repo:** [ADR-011: esquema aditivo con bootstrap idempotente](https://github.com/DavidGCalles/coreAI/blob/main/docs/adr/011-esquema-aditivo-bootstrap-idempotente.md) · [BUG-010: el arranque limpio que no creaba el esquema](https://github.com/DavidGCalles/coreAI/issues/87) · [familia del ADR-011 (#99)](https://github.com/DavidGCalles/coreAI/issues/99) · [implementación (#100)](https://github.com/DavidGCalles/coreAI/issues/100) · [PR #101](https://github.com/DavidGCalles/coreAI/pull/101) · [PR #102](https://github.com/DavidGCalles/coreAI/pull/102)
