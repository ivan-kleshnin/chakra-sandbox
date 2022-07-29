import {Alert, AlertIcon, Box, Flex, Heading, Text} from "@chakra-ui/react"
import {
  type Page, type Post,
  allPages, allPosts
} from "contentlayer/generated"
import {ParsedUrlQuery} from "querystring"
import {GetStaticProps} from "next"
import {useRouter} from "next/router"
import Head from "next/head"
import * as R from "rambda"
import {FilterOff} from "tabler-icons-react"
import {HorizontalCard, Link, Tags, Typography, WidthHolder} from "components"
import {Layout} from "layout"
import * as mdx from "lib/mdx"
import * as U from "lib/utils"

const allTags = R.sortBy(String, R.uniq(allPosts.flatMap(post => post.tags || [])))

// BlogPage
type BlogPageProps = Payload // & some Next stuff

export default function BlogPage({blog, posts}: BlogPageProps): JSX.Element {
  return <Layout>
    <Head>
      <title>{blog.seoTitle || blog.title}</title>
    </Head>
    <main>
      <Content blog={blog}/>
      <Posts posts={posts}/>
    </main>
  </Layout>
}

// Content
type ContentProps = {
  blog: Page
}

function Content({blog}: ContentProps): JSX.Element {
  const MDXContent = mdx.useComponent(blog.body.code)

  return <>
    <Box as="section" background="white">
      <WidthHolder main background="white">
        <Typography>
          <Heading as="h1" size="lg">
            {blog.title}
          </Heading>
          <MDXContent components={mdx.components}/>
        </Typography>
      </WidthHolder>
    </Box>
  </>
}

// PostsProps
type PostsProps = {
  posts: Post[]
}

function Posts({posts}: PostsProps): JSX.Element {
  const router = useRouter()

  const filterTag = router.query.tag as string | undefined
  const filteredPosts = filterTag
    ? posts.filter(post => (post.tags || []).map(t => t.toLowerCase()).includes(filterTag.toLowerCase()))
    : posts

  return <>
    <Box as="section" background="gray.100">
      <WidthHolder main>
        <Heading as="h2" size="md" marginBottom="1rem">
          Posts
          {" "}
          {filteredPosts.length == posts.length ?
            <Text as="span" color="gray.500" fontSize="md">({posts.length})</Text> :
            <Text as="span" color="gray.500" fontSize="md">({filteredPosts.length} of {posts.length})</Text>
          }
        </Heading>
        {allTags.length &&
          <Box marginBottom="1.5rem">
            <Tags tags={allTags} selectedTag={router.query.tag as string | undefined}/>
          </Box>
        }
        <Flex direction="column" gap="1rem">
          <FilteredPosts filteredPosts={filteredPosts} filterTag={filterTag}/>
        </Flex>
      </WidthHolder>
    </Box>
  </>
}

// FilteredPosts
type FilteredPostsProps = {
  filteredPosts: Post[]
  filterTag?: string
}

function FilteredPosts({filteredPosts, filterTag}: FilteredPostsProps): JSX.Element {
  if (!filteredPosts.length) {
    if (filterTag) {
      return <Alert status="info">
        <AlertIcon />
        No posts matching the tag. <Link href="/blog">Reset filters <FilterOff size="1rem"/></Link>
      </Alert>
    } else {
      return <Alert color="info">
        <AlertIcon />
        No posts yet &#128542;
      </Alert>
    }
  }

  return <>
    {filteredPosts.map((post, i) =>
      <HorizontalCard
        key={i}
        title={post.title}
        intro={post.intro.html}
        postedAt={post.createdAt}
        tags={post.tags}
        url={post.url}
      />
    )}
  </>
}

// SSR /////////////////////////////////////////////////////////////////////////////////////////////
type Payload = {
  blog: Page
  posts: Post[]
}

type Params = ParsedUrlQuery

export const getStaticProps: GetStaticProps<Payload, Params> = async () => {
  const url = "/blog"
  const blog = allPages.find(p => p.url == url)

  if (!blog) {
    throw new Error("...")
  }

  const posts = R.sort(U.byCreatedAtDesc, allPosts)

  return {
    props: {
      blog,
      posts
    }
  }
}
