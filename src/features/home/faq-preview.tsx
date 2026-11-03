import { faqs } from '../../data/site-content'
import { Accordion } from '../../components/ui/accordion'
import { Button } from '../../components/ui/button'
import { Section, SectionHeader } from '../../components/ui/section'

const preview = faqs.filter((faq) => faq.preview).map(({ question, answer }) => ({ question, answer }))

export function FaqPreview() {
  return (
    <Section tone="light" aria-labelledby="faq-title">
      <SectionHeader id="faq-title" eyebrow="FAQ" title="Questions founders ask us" />
      <div className="mx-auto lg:w-2/3">
        <Accordion items={preview} headingLevel={3} />
        <div className="mt-10 flex justify-center">
          <Button to="/faq" variant="secondary" arrow>
            View all questions
          </Button>
        </div>
      </div>
    </Section>
  )
}
