import {CloseIcon, HamburgerIcon} from "@chakra-ui/icons"
import {
  Box, Divider, Flex, Heading,
  useTheme,
} from "@chakra-ui/react"
import {useRouter} from "next/router"
import * as React from "react"
import {Link, WidthHolder} from "components"

// const [scroll] = [{y: 0}]  // useWindowScroll() -- SSR incompatible
// const logoOrder = (scroll.y > 16 * 8) ? 3 : 2
// const itemSize = (scroll.y > 16 * 8) ? "md" : "lg"
// const headerHeight = (scroll.y > 16 * 8) ? "3.5rem" : "5rem"

// MainMenu
export function MainMenu() {
  const [opened, setOpened] = React.useState(false)

  const router = useRouter()
  React.useEffect(() => {
    const close = () => setOpened(false)

    router.events.on("routeChangeStart", close)
    return () => {
      router.events.off("routeChangeStart", close)
    }
  }, [])

  return <>
    <Box
      as="header"
      background="white"
      borderBottom="1px solid lightgray"
      height="5rem"
      position="sticky"
      top="0"
      zIndex="1"
    >
      <WidthHolder>
        <Flex justify="space-between" align="center" height="100%">
          <LeftMenu/>
          <RightMenu opened={opened} setOpened={setOpened}/>
        </Flex>
      </WidthHolder>
    </Box>
  </>
}

// LeftMenu
function LeftMenu() {
  return <Flex gap="3rem" align="center">
    <Logo/>
    <Flex gap="2rem" align="center" display={["none", "none", "flex"]}>
      <Link href="/about">
        About
      </Link>
      <Link href="/testimonials">
        Testimonials
      </Link>
      <Link href="/blog">
        Blog
      </Link>
    </Flex>
  </Flex>
}

// RightMenu
function RightMenu({opened, setOpened}: any): JSX.Element {
  return <>
    <Flex alignItems="center" gap="2rem">
      <Link href="#">
        <span onClick={() => alert("This functionality is temporarily unavailable!")}>
          Sign In / Sign Up
        </span>
      </Link>
      <Box display={["block", "block", "none"]}>
        <BurgerIcon opened={opened} setOpened={setOpened}/>
        {opened &&
          <Box zIndex="1" position="fixed" top="5rem" left="0" width="100%" height="calc(100vh - 5rem)">
            <WidthHolder>
              <MobileMenu/>
            </WidthHolder>
          </Box>
        }
      </Box>
    </Flex>
  </>
}

// BurgerIcon
function BurgerIcon({opened, setOpened}: {opened: boolean, setOpened: any}): JSX.Element {
  return opened
    ? <CloseIcon sx={{cursor: "pointer"}} onClick={() => setOpened((o: any) => !o)}/>
    : <HamburgerIcon cursor="pointer" onClick={() => setOpened((o: any) => !o)}/>
}

// MobileMenu
function MobileMenu() {
  return <>
    <Flex direction="column" gap="1rem" mt="1rem">
      <Link href="/about">About</Link>
      <Divider variant="dashed"/>
      <span>Blog</span>
      <Divider variant="dashed"/>
      <span>Links</span>
    </Flex>
  </>
}

// Logo
function Logo() {
  // <Link href="/" asText>
  //   <Title mr="3rem" order={logoOrder}>PAQMIND</Title>
  // </Link>

  const theme = useTheme()

  return <Heading as="div" size="sm" sx={{
    letterSpacing: theme.letterSpacings.wide,
  }}>
    PAQMIND
  </Heading>
}
