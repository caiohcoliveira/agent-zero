# Performance Analytics — "A Interseção" (v2)

Vídeo animado executivo de 4 minutos sobre a track de Performance Analytics, com visual retrô-moderno de colagem na identidade Mastercard e camada futurista nos trechos de modelos.

- **Arquivo final:** [`performance-analytics.html`](performance-analytics.html) — um único HTML, 1920×1080, 100% offline, sem dependências.
- **Roteiro e storyboard (v2):** [`STORYLINE.md`](STORYLINE.md).
- **Checkpoint de retomada:** [`PROGRESS.md`](PROGRESS.md).

## Como assistir

1. Abra `performance-analytics.html` no Chrome ou no Edge (duplo clique).
2. Clique em **Assistir**. O áudio só pode começar depois de um clique, por regra do navegador.
3. Tecle **F** para tela cheia.

| Tecla | Ação |
|---|---|
| Espaço | play / pause |
| R | reiniciar |
| ← / → | voltar / avançar 5 s |
| F | tela cheia |
| M | trilha e efeitos on/off |
| V | narração on/off |
| C | legendas da narração on/off |

A barra de progresso aceita clique e arraste. Ao passar o mouse, ela mostra o nome da cena.

**Gravar em MP4:** basta gravar a tela em tela cheia (OBS, Xbox Game Bar ou QuickTime) com o áudio do sistema. Como tudo é desenhado em função do tempo, cada execução é idêntica.

## Narração

- A narração vem **desligada por padrão**. Para ligar, use o botão **Voz** ou a tecla **V** (ou `CONFIG.audio.voice = true`).
- Ela usa a **Web Speech API** do navegador e prefere uma voz feminina pt-BR.
- A qualidade depende das vozes instaladas no sistema:
  - **Windows / Edge:** "Francisca" e "Thalita" (naturais, exigem internet); "Maria" funciona offline.
  - **macOS:** "Luciana".
- O nome da voz em uso aparece na barra de controles.
- Cada frase dispara no seu próprio cue (`CONFIG.narration`), então a sincronia é feita frase a frase.
- Termos em inglês recebem grafia fonética (`CONFIG.phonetics`) para soar natural.

**Para usar uma locução gravada:**
1. Desligue a voz (`CONFIG.audio.voice = false`).
2. Use os tempos de `CONFIG.narration` como guia de edição.
3. Embuta o áudio no próprio HTML como `data:` URI.

## Arquitetura

```
src/
  00-head.html           HTML + CSS (palco 1920×1080, overlay inicial, controles)
  01-config.js           ★ CONFIG: cores, tempos das cenas, textos, narração, áudio, motion
  01-data.js             ★ DADOS: lê o bloco JSON "pa-data" do topo do HTML, acessos seguros e formatação pt-BR
  02-core.js             easing, interpolação, RNG com seed, cores, primitivas, câmera, fundos, granulação
  03-collage.js          ★ linguagem retrô-moderna: papel, contornos, sombras chapadas, meio-tom, fita,
                         stickers, tiras de fórmula, recortes; camada futurista (grid neon, sol, scanlines, holo)
  03-components.js       ícones vetoriais, agentes (personagens), cards, carimbo ✓, chips, dashboard
  04-viz.js              visualizações de modelos: gaussiana, regressão, classificação, árvore,
                         ensemble, clusters, anomalia, embeddings, recomendação, agentes,
                         pipeline, crédito, forecast, IA, gradiente descendente, atenção (transformer)
  05-audio.js            trilha e SFX sintetizados (Web Audio) + sistema de cues
  06-voice.js            narração (speechSynthesis) e legendas
  10…17-*.js             as 10 cenas: hook (5 desafios), problema, hub, ALS, embeddings,
                         lights-off, insights em escala, possibilidades (∞), clímax, split-flap
  90-player.js           render, transições, loop, controles, teclado
  99-tail.html
data/
  presentation.json        dados do vídeo (números mascarados), embutidos no HTML pelo build
build.sh                 junta tudo num HTML único e injeta o JSON de dados no topo
```

Depois de editar algo em `src/`, rode `./build.sh`.

**Decisões principais:**

- **Canvas 2D com render puro em função do tempo.** Cada cena é uma função `draw(ctx, t)` sem estado. Por isso o seek e a pausa são perfeitos, a barra de progresso funciona em qualquer ponto e não há acúmulo de erro. A aleatoriedade usa seed, então o resultado é sempre igual.
- **Timeline central.** As cenas têm `dur`, e os inícios são calculados em sequência. Narração, cues de som e tremores de câmera usam o tempo local de cada cena, então mudar a duração de uma cena desloca tudo o que vem depois.
- **Áudio amarrado à timeline.** Um scheduler com lookahead agenda, a cada semicolcheia (120 BPM), as notas e os SFX que caem na janela dos próximos ~160 ms. No pause ou seek, os buses são recriados e as notas pendentes são descartadas.
- **Performance.** Brilhos usam gradientes radiais em vez de `shadowBlur`, e a granulação é uma textura pré-renderizada. O render custa ~1 ms por frame.

## Estratégia de animação

- **Visual retrô-moderno de colagem:**
  - papel recortado com contorno de tinta, sombras chapadas, meio-tom, fita e stickers;
  - fórmulas reais coladas como easter eggs técnicos (cosseno, gradiente descendente, ALS, atenção, Gini, uplift, Bellman…).
- **Camada futurista nos trechos de modelos:** grid neon em perspectiva, sol listrado, scanlines e painéis holográficos.

- **Entrar rápido e assentar.** Os elementos entram com `outExpo` ou `outBack`, com um leve overshoot.
- **Câmera virtual.** Faz zoom, pan e rotação, com tremor nos impactos. A intensidade é controlada por `CONFIG.motion`.
- **Textura stop motion.** Os snaps de câmera da cena 8 são quantizados "em dois" (15 fps), sobre o resto do filme a 60 fps.
- **Ritmo claro e escuro.** As cenas alternam entre fundo claro e escuro. A virada mais forte é o apagão literal no caso lights-off.
- **Fios narrativos:**
  - as 4 perguntas da cena 2 viram os chips de capítulo, que ganham ✓;
  - os Agentes reaparecem nos casos 01 e 04, no clímax e no final;
  - o ponto laranja abre e fecha o filme.
- **Semântica de cor:** vermelho = negócio / alerta, amarelo = dados, laranja = resposta.

## Parâmetros úteis (`src/01-config.js`)

| Parâmetro | Efeito |
|---|---|
| `scenes[].dur` | duração de cada cena (o total é recalculado) |
| `colors` | paleta |
| `text` | todos os textos-chave; `*palavra*` = destaque laranja |
| `narration` | frases e tempos da narração |
| `motion.intensity`, `motion.shake`, `motion.onTwos`, `motion.grain` | energia do movimento |
| `audio.music`, `audio.sfx`, `audio.voice` (padrão: desligada), volumes, `voiceRate` | áudio |
| `caseDone` | momento do carimbo ✓ de cada caso (sincroniza os chips) |
| `captions` | legendas completas ligadas por padrão |

## Dados do vídeo

Os números e resultados das cenas vêm de um JSON embutido no topo do HTML, no bloco `<script type="application/json" id="pa-data">`.

- **No HTML pronto:** abra o arquivo num editor de texto, mude o valor no bloco `pa-data` e salve. É assim que os números mascarados podem ser trocados pelos originais.
- **No projeto:** a fonte é `data/presentation.json`. Rode `./build.sh` para gerar o HTML com ele.
- **Repositório público:**
  - troque pelos números originais só na cópia local do HTML;
  - edições feitas direto no HTML não voltam para o `data/presentation.json`. Para carregar uma mudança adiante, atualize o JSON.
- **Formatação:** é automática em pt-BR (`1.5x` → `1,5×`, `0.25MM` → `250 mil`). Um item de `headline_numbers_for_slides` aceita `display` para fixar o texto exato de tela.
- **Campos faltando:** a cena mostra "—" ou a versão sem número, em vez de quebrar.
- **Para completar depois:**
  - `other_tracks`, na seção 3;
  - os campos vazios do case Lights-off, na seção 4;
  - a Prática, na seção 6, que hoje é um rascunho a substituir pelos materiais da Nat.
- **Música:** as faixas entram embutidas no HTML. Os MP3 avulsos (`musica/`) ficam fora do Git.
