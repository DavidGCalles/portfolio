---
title: "LifeOS v3: rework greenfield y anuncio de repo público"
description: "Un proyecto personal congelado diez meses, un repo reducido a una carpeta de personas y una teoría sobre el edge. El rework de LifeOS como edge client de coreAI, en conversación."
pubDate: "2026-11-24"
tags: ["lifeos", "coreai", "ia local"]
draft: false
---

# LifeOS v3: rework greenfield y anuncio de repo público

LifeOS empezó siendo un chatbot personal sobre Telegram y acabó congelado, esperando a que existiera la pieza que le faltaba. Este es el anuncio de su regreso: una reconstrucción desde cero sobre coreAI, con el repositorio ya público. En conversación, como siempre.

## **LifeOS es tu proyecto personal más ambicioso: llevas más de un año con él. Y en febrero, el repo deja de moverse. Meses de silencio. ¿Qué pasó?**

LifeOS comenzó como una interfaz de Telegram para crear un chatbot personal y conocer la arquitectura de una aplicación estándar de IA.

Cuando su desarrollo empezó a crecer y la necesidad de procesamiento en background, gestión de errores y ciclo de vida se hizo más exigente, el proyecto alcanzó un stop lleno de problemas que requerían una profunda modificación en la capa de datos y la gestión de la memoria vectorial y relacional.

Tras un análisis, comprendí que estaba levantando LifeOS sobre unos cimientos de barro porque faltaba, literalmente, una pieza central que yo había desarrollado completamente acoplada al ciclo de vida de LifeOS (y de una manera errónea, para más inri).

De ahí salió el proyecto coreAI, que es el motivo primero del stop del proyecto y motivo último del rework que presentamos hoy.

## **Sabes que te falta una pieza central y que la construiste mal y acoplada. La mayoría en tu sitio habría abierto una rama y hecho un refactor de fin de semana. ¿Qué te hizo decir "no, esto sale del repo y se convierte en su propio proyecto"?**

Como comenté, la idea de fondo de LifeOS era un proyecto de aprendizaje de infraestructura y desarrollo IA.

Tras un análisis del estado del proyecto en ese momento, entendí que ese objetivo no estaba en el desarrollo de LifeOS, sino en una capa agnóstica y unificada de gestión de memoria, contexto y motor de eventos. Es decir, coreAI in a nutshell.

LifeOS tiene sus propios retos y, una vez extraído todo lo mencionado, estos quedan mucho más claros y definidos, ya que toda la fontanería corre a cargo de coreAI.

## **Me dices que la fontanería ya no es cosa de LifeOS. Entonces, ¿qué queda exactamente de LifeOS? ¿Qué es hoy el proyecto para ti: un chatbot con mucho menos código, o otra cosa?**

LifeOS es la respuesta local a lo que yo creo que va a ser una presión brutal contra los chatbots y apps de IA conversacional o asistencial.

Sin meternos en detalles de industria y economía, el actual ecosistema de IA es insostenible económicamente y mi teoría es que la IA dejará de estar centralizada y pasará al edge de muchas maneras diferentes.

Es un chatbot, sí. Con mucho menos (y mejor) código, también. Pero es, por otro lado, filosofía, predicción de futuro y prueba de concepto de otras posibles vías para una IA rentable y soberana.

## **Tu teoría es la del edge, pero honestamente, todo el mundo tiene una teoría. ¿Qué hiciste esta vez que la convierta en algo más que palabras?**

Para que te hagas una idea: el proyecto inicial mantenía paridad entre despliegue cloud en GCP y despliegue local.

Una de las primeras cosas que desapareció de LifeOS fue precisamente el despliegue cloud. Tras el análisis económico de despliegue es sencillamente inviable económicamente, y es uno de los selling points más fuertes para pasar a local puro.

## **"Inviable" es una palabra grande. Un despliegue cloud de un chatbot personal, ¿cuánto cuesta de verdad? Dame el número que a ti te hizo cerrar la puerta.**

Estamos hablando de más de 400 euros al mes.

Base de datos vectorial. Base de datos relacional. Servidor de embeddings Infinity con 3 modelos dentro. Y media docena de servicios más.

Ni GKE ni Cloud Run (los más aptos para este tipo de desarrollo) eran económicamente/técnicamente viables por diversas razones. La principal de ellas: la factura, con un suelo altísimo y un techo potencialmente infinito dependiendo del uso, porque claro, también había que pagar tokens de LLM por API elegida.

## **400 euros al mes para un proyecto donde tú eres el único usuario. Ya. Pongámonos en el rework: más de un año de commits, decisiones documentadas, mucho código escrito. ¿Qué hiciste con todo eso?**

Debido al acoplamiento, apenas ha sobrevivido nada excepto los documentos fundacionales, los cuales también necesitan un serio rework.

Este código sigue existiendo como legacy y será visitable y recuperable, ya que me gustaría usar esa primera etapa (con su documentación y sus decisiones incluidas) como un caso de estudio en este propio blog sobre cómo se podría haber evitado el problema, o al menos mitigado.

## **Estuve hojeando el repo antes de esta charla. Hay una rama nueva, cortada de un main que lleva congelado desde febrero, con un primer commit llamativo: el árbol entero del proyecto queda reducido a una única carpeta, `personas/`, con dos ficheros YAML dentro. Tú lo llamas "El Tajo". Explícame eso: qué se barre, qué se guarda y por qué el tajo es el primer movimiento y no el último.**

Quizá fui muy coloquial con el nombre, pero me parecía que encajaba bien.

Se barrió todo para que, en caso de que surja la tentación de la reutilización, no se caiga en vicios de acoplamiento o malos procesos de la versión legacy.

Respecto a lo que ha quedado: esa carpeta `personas` contiene los especialistas de LifeOS. Con una estructura paralela al MoE interno de los LLM, el modelo carga esas personalidades y actúa bajo sus directrices.

Esto, a mi entender, es núcleo de LifeOS como tal. Esos especialistas son los que luego ayudarán al usuario y dialogarán entre sí en las conversaciones.

## **Y ya que estamos en el repo: en la primera era se respiraba CrewAI por todos lados, en los requirements, en la estructura de los agentes. En la rama nueva no queda ni rastro del framework, y sin embargo los especialistas siguen ahí. ¿Qué corre ahora debajo de esos especialistas, y quién decide cuál de ellos te contesta cuando le escribes?**

CrewAI fue una decisión inicial en LifeOS al mezclar los términos "personas", "conversación" e "interacción". Pero es un framework con MUCHÍSIMO overhead y es completamente equivocado para una aplicación donde el tiempo de respuesta es valioso.

Hoy por hoy no corre ningún otro framework por debajo, ya que aprendí suficiente de los procesos para desarrollar un orquestador más streamlined.

El router como tal se ha eliminado de la nueva versión. Dado que el diseño está atado a Telegram, se van a utilizar las características nativas de este, como las menciones y los "reply to", para invocar a los agentes y generar conversaciones, tanto con ellos como entre ellos.

## **Menciones y reply para invocar a un especialista concreto. Muy bien. Pero ¿qué pasa si entro al chat y no menciono a nadie? ¿Quién me contesta?**

Hay una persona por defecto llamada Jane, que será el agente principal, conversacional y, en última instancia, la decisora/bloqueadora de las conversaciones entre los agentes para evitar bucles o incoherencias.

## **Pongamos que el rework avanza, los especialistas charlan, Jane gobierna. ¿Cómo evitas el clásico final del proyecto personal eterno, el que nunca echa el clavo del todo? ¿Cuál es tu varita de "esto ya está"?**

Acabas de mencionarla a la perfección. El momento en el que el usuario pueda tener una conversación con Jane, implicar a otros agentes, ver cómo esos agentes se responden y llegar a una conclusión es el "v1" (término extraño hablando de un rework, supongo).

Eso es el núcleo funcional de todo. Te pongo el ejemplo que tengo en mente. El usuario entra y comenta, sin mencionar a nadie, que está reflexionando si realizar una inversión o gastar ese dinero en alguna otra cosa. Jane debe responder, pero a la vez entender que el mejor especialista para eso es el económico y mencionarlo como si fuera una persona, con @. Podría incluso llegar (dependiendo del contexto de la pregunta) a entender que una de las decisiones involucra a su familia y mencionar al especialista financiero y al consejero familiar.

En ese momento empezará una conversación entre esos dos especialistas y el usuario, donde Jane sólo intervendrá si se dan ciertos supuestos o kill switches.

## **Última. Hay un capítulo en esta historia que todavía no se ha escrito: esa rama de rework y ese main congelado desde febrero tienen que encontrarse un día. ¿Cómo será ese encuentro, y qué encontrará ahí el lector que hoy llegue al repo?**

Pues se encontrarán el día que iguale las características del antiguo LifeOS. Lo cual será pronto, porque realmente la mayoría de las características del LifeOS legacy viven en el proyecto coreAI.

Este, sinceramente, ha sido el rework más grande y más centrado en eliminar contenido que he hecho jamás.

*El repositorio de LifeOS pasa a público junto a este anuncio: la primera era (ADRs, issues y decisiones incluidas) queda visitable como una novela de caso de uso, y la reconstrucción se sigue en su epic, con el gate de paridad de v1 como hoja de ruta observable del rework.*

**La historia en el repo:** [LifeOS](https://github.com/DavidGCalles/lifeOS) · [EPIC #156: Rework greenfield, DoD de paridad v1](https://github.com/DavidGCalles/lifeOS/issues/156) · la serie completa de ADRs en el propio repo.
