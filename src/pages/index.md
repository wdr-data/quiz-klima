---
title: 'Das große WDR Klima-Quiz'
description: Stellen Sie ihr Wissen auf die Probe beim großen WDR Klima-Quiz
author: Jörn Seidel
pub_date: '2021-02-28'
heroImage: 'richard-wagner-und-freunde.jpg'
heroAlt: 'Richard Wagner und seine Freunde'
heroCredit: 'Richard Wagner und seine Freunde'
sharingImageFacebook: 'richard-wagner-und-freunde_facebook.jpg'
sharingImageTwitter: 'richard-wagner-und-freunde_twitter.jpg'
cg1: 'WDR'
cg2: 'Data'
cg3: 'Quiz'
cg4: 'Klima'
---

import DataWrapper from '../components/datawrapper/datawrapper.jsx'
import Quote from '../components/quote/quote.jsx'
import Webtrekk from '../components/webtrekk/webtrekk.jsx'
import Sharing from '../components/sharing/sharing.jsx'
import YDIBar from '../components/ydi/ydiBar.jsx'
import YDILine from '../components/ydi/ydiLine.jsx'
import { Link, LinkList } from '../components/link/link.jsx'
import { Quiz, Image as QuizImage, Question, Answer, Result, Score as QuizScore } from '../components/quiz/quiz.jsx'

## Stellen Sie ihr Wissen auf die Probe

# Das große WDR Klima-Quiz

Minim culpa ea nisi pariatur cillum quis excepteur deserunt ullamco mollit fugiat id reprehenderit. Sit reprehenderit duis sint in. Deserunt dolore Lorem eiusmod sint labore tempor. Adipisicing eiusmod cillum consequat anim non.

## Wohnen

Wer wohnt, erzeugt CO<sub>2</sub> - durch Warmwasser, Raumwärme, Beleuchtung, Elektrogeräte und Prozesswärme (Kochen/Waschen).

<Quiz>
<QuizImage src="berthold-schneider-credit-jens-grossmann.jpg" alt="Der Wuppertaler Opernintendant Berthold Schneider, fotografiert von Jens Grossmann" />
<Question>** Wie viel Prozent des gesamten CO<sub>2</sub>-Ausstoßes im Bereich Wohnen verursacht die Raumwärme? **</Question>
<Answer>34 %</Answer>
<Answer>57 %</Answer>
<Answer correct>68 %</Answer>
<Answer>81 %</Answer>
<Result>
Richtig ist: Die Raumwärme verursacht mit **68 %** den mit Abstand größten CO<sub>2</sub>-Ausstoß im Bereich Wohnen, so das [Statistische Bundesamt](https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Umwelt/UGR/private-haushalte/Publikationen/Downloads/haushalte-umwelt-pdf-5851319.html;jsessionid=C1016A413EE3ED349CA17A88F495C630.live712) für das Jahr 2019. Wer weniger heizt, schont das Klima. Schon ein Grad weniger macht viel aus. Die anderen Anwendungsbereiche verursachen so viel CO<sub>2</sub>: Warmwasser 12 %, Elektrogeräte 11 %, Prozesswärme (Waschen/Kochen) 7 %, Beleuchtung 2 %.
</Result>
</Quiz>

Sint pariatur aliquip anim magna fugiat occaecat ut ullamco eu non commodo eu do elit. Cillum ad occaecat veniam quis ea consequat duis sit voluptate eu. Aute ut fugiat qui nulla nulla amet et. Officia eu ea ipsum exercitation ipsum commodo est nisi cillum est cupidatat. Ad amet duis irure qui sint dolor eiusmod ut aliqua labore aliquip enim.

<Quiz>
<Question>**Hier könnte ihre Frage stehen?**</Question>
<Answer>Hier klicken!</Answer>
<Answer>Foobar</Answer>
<Answer>Richtige Antwort</Answer>
<Answer correct>42</Answer>
<Result>
Natürlich ist **42** die richtige Antwort.
</Result>
</Quiz>

Lorem dolore irure consequat ullamco sint culpa incididunt esse. Pariatur exercitation cillum occaecat consectetur culpa minim adipisicing laboris exercitation esse magna cupidatat. Labore magna quis excepteur velit officia excepteur ea proident sit enim ut. Pariatur minim anim officia consequat labore quis sit cupidatat.

<Quiz>
<Question>**Hier könnte ihre Frage stehen?**</Question>
<Answer>Richtige Antwort</Answer>
<Answer>Hier klicken!</Answer>
<Answer correct>42</Answer>
<Answer>Foobar</Answer>
<Result>
Natürlich ist **42** die richtige Antwort.
</Result>
</Quiz>

Ex ad do velit nostrud aliqua ex ad mollit tempor velit aute tempor. Occaecat deserunt do aliquip duis aute voluptate magna adipisicing eiusmod fugiat. Nisi minim aute sit fugiat sit nulla dolor exercitation ullamco quis fugiat eiusmod culpa nulla. Officia excepteur proident do exercitation cillum irure mollit elit laboris exercitation adipisicing.

<QuizScore
images={{
    0: "berthold-schneider-credit-jens-grossmann.jpg",
    2: "richard-wagner-und-freunde_twitter.jpg",
}}
texts={{
    0: "Schade, das war wohl nix.",
    2: "Gute Arbeit",
}}
/>

<Link title="Dies ist ein Beispiel für einen einzelnen Link" href="https://example.com/" />

<LinkList links={[
{
title: "Dies ist ein Beispiel für eine Link-Liste",
href: "https://example.com/",
},
{
title: "Dies ist noch ein Beispiel für eine Link-Liste",
href: "https://example.com/",
},
]} />

## Beispiel WSS Line Chart:

<YDILine name="test_line"/>

## Beispiel WSS Bar Chart:

<YDIBar name="test"/>

<Link title="Climate Clock" href="https://climateclock.world/" />

<Quote author="Bo Burnham">20.000 years of this, 7 more to go</Quote>

<Link title="That Funny Feeling, Bo Burnham" href="https://www.youtube.com/watch?v=ObOqq1knVxs" />

<Sharing twitter facebook mail whatsapp telegram reddit xing linkedin />
