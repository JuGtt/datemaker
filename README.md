# Ju & Jenni 💕

Um pedido de encontro em forma de site. Ela vê a pergunta, o botão "Não" foge
toda vez que o mouse chega perto (farmando aura no processo 😎), e quando ela
clica em "Sim" escolhe um dia e horário dentro do limite que você definiu.
No final, um botão já abre o WhatsApp com a mensagem pronta pra te enviar.

Não usa nenhuma biblioteca externa, arquivo de áudio ou build — só
`index.html`, `style.css` e `script.js`. A "música" é gerada na hora via
Web Audio API, então não tem problema de direitos autorais nem arquivo pra
carregar.

## Testar localmente

Só abrir o `index.html` no navegador. Se quiser testar como vai ficar no
GitHub Pages (recomendado, alguns navegadores são chatos com áudio/arquivos
locais), rode um servidor simples na pasta:

```
python -m http.server 8000
```

e acesse `http://localhost:8000`.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `date-jenni`). Se sua conta for
   free, o repositório precisa ser **público** pra o Pages funcionar (não se
   preocupa, ninguém acha sem o link).
2. Dentro desta pasta:
   ```
   git init
   git add .
   git commit -m "Pedido de date pra Jenni"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/date-jenni.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings > Pages**, escolha a branch `main` e a pasta
   `/ (root)`, salve.
4. Espere 1-2 minutos. O link vai ser algo como
   `https://SEU_USUARIO.github.io/date-jenni/`.
5. Manda esse link pra ela 💌

## Customizar

Tudo que você provavelmente vai querer mexer está no topo do
[script.js](script.js), no objeto `CONFIG`:

- `whatsappNumber` — número que recebe a mensagem quando ela confirma.
- `dateRangeDays` — quantos dias no futuro ela pode escolher (hoje: 14).
- `timeSlots` — os horários disponíveis (hoje: 19h às 22h).
- `eventDurationHours` — duração do evento no calendário (hoje: 2h).

As frases do botão "Não" que foge estão no array `taunts`, também no
`script.js` — pode editar, adicionar ou remover à vontade.

As cores (preto + rosa/vermelho + dourado) estão como variáveis CSS no topo
do [style.css](style.css), em `:root`.

## Como funciona o envio

Como o site é só front-end (sem servidor), a entrega da data escolhida é via
link do WhatsApp (`wa.me`) com a mensagem já preenchida — ela só precisa
apertar "enviar". Além disso, a tela final oferece um link de "Adicionar ao
Google Calendar".
