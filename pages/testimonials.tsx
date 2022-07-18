import {Alert, AlertIcon, Box, Flex, Heading, Text} from "@chakra-ui/react"
import {
  type Account, type Page, type Testimonial,
  allPages, allTestimonials, allAccounts
} from "contentlayer/generated"
import {ParsedUrlQuery} from "querystring"
import {GetStaticProps} from "next"
import Head from "next/head"
import {useMDXComponent} from "next-contentlayer/hooks"
import {CommentCard, Link, Typography, WidthHolder} from "components"
import * as U from "lib/utils"

// TestimonialsPage
type TestimonialsPageProps = Payload // & some Next stuff

export default function TestimonialsPage({accounts, page, testimonials}: TestimonialsPageProps): JSX.Element {
  return <>
    <Head>
      <title>{page.seoTitle || page.title}</title>
    </Head>
    <main>
      <Content page={page}/>
      <Testimonials accounts={accounts} testimonials={testimonials}/>
    </main>
  </>
}

// Content
type ContentProps = {
  page: Page
}

function Content({page}: ContentProps): JSX.Element {
  const MDXContent = useMDXComponent(page.body.code)

  return <>
    <Box as="section" background="white">
      <WidthHolder main background="white">
        <Typography>
          <Heading as="h1" size="lg">
            {page.title}
          </Heading>
          <MDXContent/>
        </Typography>
      </WidthHolder>
    </Box>
  </>
}

// Testimonials
type TestimonialsProps = {
  accounts: Account[]
  testimonials: Testimonial[]
}

function Testimonials({accounts, testimonials}: TestimonialsProps): JSX.Element {
  return <>
    <Box as="section" background="#eee">
      <WidthHolder main>
        <Heading as="h2" size="md" mb="1rem">
          Testimonials to <Link href="#">Ivan Kleshnin</Link>
          {" "}
          <Text as="span" color="gray" fontSize="md">
            ({testimonials.length})
          </Text>
        </Heading>
        <Flex direction="column" gap="1rem">
          <FilteredTestimonials accounts={accounts} testimonials={testimonials}/>
        </Flex>
      </WidthHolder>
    </Box>
  </>
}

// FilteredTestimonials
function FilteredTestimonials({accounts, testimonials}: TestimonialsProps): JSX.Element {
  if (!testimonials.length) {
    return <Alert color="info">
      <AlertIcon />
      No testimonials yet &#128542;
    </Alert>
  }

  const enrichedTestimonials = testimonials.flatMap(testimonial => {
    const author = accounts.find(account => account.id == testimonial.fromAccountId)
    if (!author) return []
    return [{
      ...testimonial,
      body: testimonial.body.html,
      createdAt: testimonial.createdAt,
      author,
    }]
  })

  return <>
    {enrichedTestimonials.map((testimonial, i) =>
      <CommentCard key={i} {...testimonial}/>
    )}
  </>
}



// SSR /////////////////////////////////////////////////////////////////////////////////////////////
type Payload = {
  accounts: Account[]
  page: Page
  testimonials: Testimonial[]
}

type Params = ParsedUrlQuery

export const getStaticProps: GetStaticProps<Payload, Params> = async () => {
  const url = "/testimonials"
  const page = allPages.find(p => p.url == url)

  if (!page) {
    throw new Error("...")
  }

  const accounts = allAccounts
  const testimonials = [...allTestimonials].sort(U.byCreatedAtDesc)

  return {
    props: {
      accounts,
      page,
      testimonials,
    }
  }
}