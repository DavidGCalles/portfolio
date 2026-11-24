---
title: "La DLQ, o el arte de morir bien"
description: "El roadmap inicial de coreAI se cerró con la pieza menos glamurosa: reintentos, clasificación de fallos y una cola de muertos. La semana en que cayeron sus tres escalones, en conversación."
pubDate: "2026-11-25"
tags: ["coreai", "arquitectura", "resiliencia"]
draft: false
---

# La DLQ, o el arte de morir bien

El roadmap inicial de coreAI se cerró con la pieza menos glamurosa del catálogo: reintentos, clasificación de fallos y una dead letter queue. Esta es la conversación sobre esa pieza que nadie quiere usar nunca y que sostiene a todas las demás.

## **coreAI corre en tu propia máquina, bajo tu control. ¿Qué falla en un sistema así para que haga falta una cola de muertos?**

No es lo que falla. Es lo que PUEDE fallar. Un sistema como coreAI tiene muchas piezas móviles y flujos de información.

Dado que es un sistema hecho para ser consumido por clientes, puede darse que el cliente envíe peticiones erróneas o mal formadas. También puede suceder que una de las piezas pierda conectividad. En general, y quizá es mi experiencia en sistemas de alta trazabilidad y responsabilidad, mi máxima es "registra, registra, registra". Si no registras, no auditas. Si no auditas, no vas a saber si existen grietas, porque no ves las gotas caer.

## **Antes de la DLQ, cuando una tarea fallaba, ¿qué opciones había?**

Lo que más dolía, y por eso existe la DLQ, es que no hay punto medio entre bloquear la cola y desechar en silencio. La DLQ ES el punto medio.

Cualquier cliente de coreAI necesita una visibilidad básica de las tareas para funcionar y una opción de retry.

## **En el repo, el issue que lo definió se llama "clasificación veneno/recuperable". ¿Veneno?**

Es un coloquialismo que surgió hablando con la IA y llegó al repo. Veneno es igual a fallo determinista. Una petición malformada es un fallo determinista. Una caída de red es un fallo transitorio.

## **¿Y esa línea entre fallo determinista y fallo transitorio la dibujaste a la primera?**

No, aunque tengo bastante claro que seguro se me ha escapado algo y estoy esperando que el uso lo destape.

## **¿Cómo se prueba una cosa así? ¿Qué hubo que romper a propósito?**

Hice varias pruebas con piezas del sistema desconectadas, obligué a los clientes existentes a lanzar peticiones malformadas, parámetros fuera de rango, tipos de tarea inexistentes, etcétera. Hay toda una suite de observabilidad con sus dashboards en Grafana donde se puede controlar y visualizar todas las tareas y su estado.

## **¿Y funcionó? ¿Se notó?**

La implementación fue limpísima, hasta el punto de que pensaba que la DLQ estaba fallando o yo haciendo algo mal. La tarea falló y recuperó perfectamente al primer intento y, siendo una tarea pequeña de prueba, fue tan rápido que en un principio no entendí si había funcionado o no.

## **También la dejaste morir del todo. ¿Qué se siente ver el cadáver?**

Hubo. También, en cierto modo, fue satisfactorio. Aunque supongo que es algo que "no quieres usar nunca", el orgullo de ingeniero se vio muy exaltado al ver que no bloqueaba la cola y quedaba muerta hasta la reinyección.

## **El epic se partió en tres escalones y los tres cayeron el mismo martes. ¿Suerte, plan barato o vicio de veterano?**

Vicio de veterano, principalmente. Sabía que eran los últimos issues del roadmap inicial y la emoción era real.

Básicamente hice trampas. Cuando la implementación del primer issue salió volando, reorganicé toda la semana para sacar esos issues lo primero.

Considero que la moral y la emoción son algo muy infravalorado en el mundo de la ingeniería de software. Un gran, gran motivo del burn de muchos de nosotros. La pasión por el oficio es algo muy poderoso, pero convertirnos en burócratas picateclas no lo aguanta ninguna pasión.

## **Y con el roadmap cerrado, en el repo queda un issue abierto. ¿Cuál es la historia?**

El bug de las garantías de arranque se está tratando, porque tiene mucho que ver con cómo los clientes inicializan coreAI.

Si te soy sincero, ese bug ha persistido hasta el último momento porque en desarrollo tiendo a no volar los volúmenes de datos a menudo, o nunca.

## **El epic se llama "Córtex Asíncrono (Motor de Eventos Relacional)". ¿De dónde salen esos nombres?**

Mi aproximación a todo esto es biológica, por así decirlo. Estamos creando ya organismos que piensan, razonan, enlazan, con diferentes capas de inputs como nuestros sentidos. El nombre cortex viene de ahí.

Pero la verdad es que la industria tiene una manera de ser particular al respecto de esta clase de pensamientos; de ahí el nombre del paréntesis, que será, seguramente, el nombre final.

*La cascada completa está en el repositorio: los tres escalones, las tres PRs del martes y el bug que quedó abierto a propósito como siguiente paso de hardening.*

**La historia en el repo:** [Epic 4: Córtex Asíncrono, Motor de Eventos Relacional (#26)](https://github.com/DavidGCalles/coreAI/issues/26) · [4.4: Resiliencia, Retries y Dead Letter Queue (#30)](https://github.com/DavidGCalles/coreAI/issues/30) · [4.4-001 (#103)](https://github.com/DavidGCalles/coreAI/issues/103) · [4.4-002 (#104)](https://github.com/DavidGCalles/coreAI/issues/104) · [4.4-003 (#105)](https://github.com/DavidGCalles/coreAI/issues/105) · [PR #106](https://github.com/DavidGCalles/coreAI/pull/106) · [PR #108](https://github.com/DavidGCalles/coreAI/pull/108) · [PR #109](https://github.com/DavidGCalles/coreAI/pull/109) · [BUG-011: garantías de arranque asimétricas (#107), abierto a propósito](https://github.com/DavidGCalles/coreAI/issues/107)
