import type { Block, Concept } from "@/content/types";
import { CodeBlock } from "@/components/content/CodeBlock";
import { ConceptCard } from "@/components/content/ConceptCard";
import { DataTable } from "@/components/content/DataTable";
import { ExerciseSheetView } from "@/components/content/ExerciseSheetView";
import { FigureImage } from "@/components/content/FigureImage";
import { Formula } from "@/components/content/Formula";
import { HighlightList } from "@/components/content/HighlightList";
import { InfoBox } from "@/components/content/InfoBox";
import { InteractivePanel } from "@/components/content/InteractivePanel";
import { Markdown } from "@/components/content/Markdown";
import { MemoryCards } from "@/components/content/MemoryCards";
import { PracticeSet } from "@/components/content/PracticeSet";
import { Timeline } from "@/components/content/Timeline";
import { WorkedExample } from "@/components/content/WorkedExample";
import { WidgetHost } from "@/widgets/WidgetHost";

interface BlockRendererProps {
  block: Block;
  concepts: Concept[];
}

export function BlockRenderer({ block, concepts }: BlockRendererProps) {
  switch (block.kind) {
    case "prose":
      return <Markdown>{block.md}</Markdown>;

    case "info":
      return (
        <InfoBox variant={block.variant} title={block.title}>
          {block.md}
        </InfoBox>
      );

    case "concepts": {
      const selected = block.ids
        .map((id) => concepts.find((concept) => concept.id === id))
        .filter((concept): concept is Concept => Boolean(concept));

      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {selected.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      );
    }

    case "formula":
      return <Formula tex={block.tex} caption={block.caption} />;

    case "code":
      return <CodeBlock code={block.code} lang={block.lang} caption={block.caption} run={block.run} />;

    case "table":
      return <DataTable headers={block.headers} rows={block.rows} caption={block.caption} />;

    case "figure":
      return (
        <FigureImage src={block.src} alt={block.alt} width={block.width} height={block.height} caption={block.caption} />
      );

    case "steps":
      return <WorkedExample title={block.title} intro={block.intro} steps={block.steps} />;

    case "timeline":
      return <Timeline items={block.items} />;

    case "list":
      return <HighlightList variant={block.variant} items={block.items} />;

    case "exercises":
      return <ExerciseSheetView sheet={block.sheet} />;

    case "recall":
      return <MemoryCards cards={block.cards} />;

    case "practice":
      return <PracticeSet id={block.id} tasks={block.tasks} />;

    case "interactive": {
      const Interactive = block.component;
      return (
        <InteractivePanel title={block.title} description={block.description}>
          <Interactive />
        </InteractivePanel>
      );
    }

    case "widget":
      return <WidgetHost type={block.type} title={block.title} description={block.description} props={block.props} />;
  }
}
