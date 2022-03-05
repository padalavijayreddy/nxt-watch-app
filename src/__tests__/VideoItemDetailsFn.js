import 'jest-styled-components'
import {BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

const websiteDarkThemeLogo =
  'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'

const homeRoutePath = '/'
const trendingRoutePath = '/trending'
const gamingRoutePath = '/gaming'
const savedVideosRoutePath = '/saved-videos'
const videoItemDetailRoutePath = '/videos/802fcd20-1490-43c5-9e66-ce6dfefb40d1'

const mockGetCookie = (returnToken = true) => {
  let mockedGetCookie
  if (returnToken) {
    mockedGetCookie = jest.fn(() => ({
      jwt_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjE5MDk0MjQxfQ.1i6BbQkQvtvpv72lHPNbl2JOZIB03uRcPbchYYCkL9o',
    }))
  } else {
    mockedGetCookie = jest.fn(() => undefined)
  }
  jest.spyOn(Cookies, 'get')
  Cookies.get = mockedGetCookie
}

const restoreGetCookieFns = () => {
  Cookies.get.mockRestore()
}

const renderWithBrowserRouter = (
  ui = <App />,
  {route = videoItemDetailRoutePath} = {},
) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

const homeVideosResponse = {
  total: 2,
  videos: [
    {
      channel: {
        name: 'RELOADER',
        profile_image_url:
          'https://yt3.ggpht.com/ytc/AKedOLThy0OwLxXhdxojcnN1jV02JCv8Ffnbe3Y7BA6T=s68-c-k-c0x00ffffff-no-rj',
      },
      id: 'a19d93d6-bdac-479e-b554-974ef9e6e66c',
      published_at: 'Jan 28, 2020',
      thumbnail_url:
        'https://i.ytimg.com/vi/cfVY9wLKltA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZc-T-P1JxjqrqxJaCD02UbGNlHA',
      title: 'Node js Concepts Revision',
      view_count: '182K',
    },
    {
      channel: {
        name: 'Codevolution',
        profile_image_url:
          'https://yt3.ggpht.com/os7Yw6RimtysXXpc8NrXraci87TjXgZSUQyAezi0D3RrNL3YP5riIwi1-0al4Wz0XwzH6oBu6g=s88-c-k-c0x00ffffff-no-rj',
      },
      id: '4f757b30-06be-4776-b466-4181d6646729',
      published_at: 'Aug 1, 2021',
      thumbnail_url:
        'https://i.ytimg.com/an_webp/tQ80uAyqVyI/mqdefault_6s.webp?du=3000&sqp=CMD7gokG&rs=AOn4CLD9MJWdZK3yZQN8pwi7S8DAWF9bQQ',
      title: 'JSX Concepts in Hooks',
      view_count: '256K',
    },
  ],
}

const trendingVideosResponse = {
  total: 2,
  videos: [
    {
      channel: {
        name: 'Namasthe Javascript',
        profile_image_url:
          'https://yt3.ggpht.com/ytc/AKedOLThy0OwLxXhdxojcnN1jV02JCv8Ffnbe3Y7BA6T=s68-c-k-c0x00ffffff-no-rj',
      },
      id: '802fcd20-1490-43c5-9e66-ce6dfefb40d1',
      published_at: 'Oct 7, 2019',
      thumbnail_url:
        'https://i.ytimg.com/vi/cfVY9wLKltA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZc-T-P1JxjqrqxJaCD02UbGNlHA',
      title: 'React Redux Tutorials - 14 - React Redux Setup100',
      view_count: '182K',
    },
    {
      channel: {
        name: 'Codevolution',
        profile_image_url:
          'https://yt3.ggpht.com/os7Yw6RimtysXXpc8NrXraci87TjXgZSUQyAezi0D3RrNL3YP5riIwi1-0al4Wz0XwzH6oBu6g=s88-c-k-c0x00ffffff-no-rj',
      },
      id: '4f757b30-06be-4776-b466-4181d6646729',
      published_at: 'Aug 1, 2021',
      thumbnail_url:
        'https://i.ytimg.com/an_webp/tQ80uAyqVyI/mqdefault_6s.webp?du=3000&sqp=CMD7gokG&rs=AOn4CLD9MJWdZK3yZQN8pwi7S8DAWF9bQQ',
      title: 'JSX Concepts in Hooks',
      view_count: '256K',
    },
  ],
}

const gamingVideosResponse = {
  total: 2,
  videos: [
    {
      channel: {
        name: 'Namasthe Javascript',
        profile_image_url:
          'https://yt3.ggpht.com/ytc/AKedOLThy0OwLxXhdxojcnN1jV02JCv8Ffnbe3Y7BA6T=s68-c-k-c0x00ffffff-no-rj',
      },
      id: '802fcd20-1490-43c5-9e66-ce6dfefb40d1',
      published_at: 'Oct 7, 2019',
      thumbnail_url:
        'https://i.ytimg.com/vi/cfVY9wLKltA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZc-T-P1JxjqrqxJaCD02UbGNlHA',
      title: 'React Redux Tutorials - 14 - React Redux Setup100',
      view_count: '182K',
    },
    {
      channel: {
        name: 'Codevolution',
        profile_image_url:
          'https://yt3.ggpht.com/os7Yw6RimtysXXpc8NrXraci87TjXgZSUQyAezi0D3RrNL3YP5riIwi1-0al4Wz0XwzH6oBu6g=s88-c-k-c0x00ffffff-no-rj',
      },
      id: '4f757b30-06be-4776-b466-4181d6646729',
      published_at: 'Aug 1, 2021',
      thumbnail_url:
        'https://i.ytimg.com/an_webp/tQ80uAyqVyI/mqdefault_6s.webp?du=3000&sqp=CMD7gokG&rs=AOn4CLD9MJWdZK3yZQN8pwi7S8DAWF9bQQ',
      title: 'JSX Concepts in Hooks',
      view_count: '256K',
    },
  ],
}

const videoDetailsResponse = {
  video_details: {
    channel: {
      name: 'Namasthe Javascript',
      profile_image_url:
        'https://yt3.ggpht.com/os7Yw6RimtysXXpc8NrXraci87TjXgZSUQyAezi0D3RrNL3YP5riIwi1-0al4Wz0XwzH6oBu6g=s88-c-k-c0x00ffffff-no-rj',
      subscriber_count: '12M',
    },
    description:
      '++ Twitter - https://twitter.com/CodevolutionWeb+ Facebook - https://www.facebook.com/codevolutionweb Kite Code Completetion - https://www.kite.com/get-kite/?utm_me...',
    id: '802fcd20-1490-43c5-9e66-ce6dfefb40d1',
    published_at: 'Oct 7, 2019',
    thumbnail_url:
      'https://i.ytimg.com/an_webp/tQ80uAyqVyI/mqdefault_6s.webp?du=3000&sqp=CMD7gokG&rs=AOn4CLD9MJWdZK3yZQN8pwi7S8DAWF9bQQ',
    title: 'React Redux Tutorials - 14 - React Redux Setup100',
    video_url: 'https://www.youtube.com/watch?v=0bVP5cYhMuU&t=1s',
    view_count: '182K',
  },
  similar_videos: [
    {
      channel: {
        name: 'Movieclips Trailers',
        profile_image_url:
          'https://yt3.ggpht.com/ytc/AKedOLThy0OwLxXhdxojcnN1jV02JCv8Ffnbe3Y7BA6T=s68-c-k-c0x00ffffff-no-rj',
      },
      id: '5f7aaa9b-6277-4764-ba97-fb31ee94ebf1',
      published_at: 'Aug 22, 2020',
      thumbnail_url:
        'https://i.ytimg.com/vi/7ApW3NUmUEo/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB50NEnK0nqzyeLPR_QaTh0KRl_FA',
      title: 'Introducing HTML Basics',
      video_url: 'https://www.youtube.com/watch?v=IJirIF5PEKI',
      view_count: '25K',
    },
    {
      channel: {
        name: 'NS Entertainment',
        profile_image_url:
          'https://yt3.ggpht.com/ytc/AKedOLSjGqqe9T8yErW84grs2CxlpSNMTxIz8JUSH4D7gg=s68-c-k-c0x00ffffff-no-rj',
      },
      id: '7694db06-cb59-4d19-9fa0-4edce53e1805',
      published_at: 'Sep 15, 2021',
      thumbnail_url:
        'https://i.ytimg.com/vi/7ApW3NUmUEo/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB50NEnK0nqzyeLPR_QaTh0KRl_FA',
      title: 'JavaScript Settings And Controls',
      video_url: 'https://www.youtube.com/watch?v=qtO7qkxG7lI',
      view_count: '63K',
    },
  ],
}

const homeVideosApiUrl = 'https://apis.ccbp.in/videos/all'

const trendingVideosApiUrl = 'https://apis.ccbp.in/videos/trending'

const gamingVideosApiUrl = 'https://apis.ccbp.in/videos/gaming'

const videoDetailsApiUrl =
  'https://apis.ccbp.in/videos/802fcd20-1490-43c5-9e66-ce6dfefb40d1'

const handlers = [
  rest.get(homeVideosApiUrl, (req, res, ctx) =>
    res(ctx.json(homeVideosResponse)),
  ),
  rest.get(trendingVideosApiUrl, (req, res, ctx) =>
    res(ctx.json(trendingVideosResponse)),
  ),
  rest.get(gamingVideosApiUrl, (req, res, ctx) =>
    res(ctx.json(gamingVideosResponse)),
  ),
  rest.get(videoDetailsApiUrl, (req, res, ctx) =>
    res(ctx.json(videoDetailsResponse)),
  ),
]

const server = setupServer(...handlers)

const originalConsoleError = console.error
const originalFetch = window.fetch

describe('Video Item Details Route Functionality tests', () => {
  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    console.error = originalConsoleError
    window.fetch = originalFetch
  })

  afterAll(() => {
    server.close()
  })

  it('When the theme icon button in the Video Item Details Route is clicked, then the page should change to dark theme and consist of the HTML container element with data-testid attribute value as "videoItemDetails" and background color as "#0f0f0f":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const themeBtns = screen.getAllByTestId('theme')

    userEvent.click(themeBtns[0])

    expect(await screen.findByTestId('videoItemDetails')).toHaveStyle(
      'background-color: #0f0f0f',
    )
    restoreGetCookieFns()
  })

  it('When the theme icon button in the Video Item Details Route is clicked, and the Home link is clicked, then the page should be navigated to the Home Route, and the theme should remain the same:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const themeBtns = screen.getAllByTestId('theme')

    userEvent.click(themeBtns[0])

    const videoItemDetailsImageEls = screen.getAllByRole('img', {
      hidden: true,
      name: /website logo/i,
    })
    expect(videoItemDetailsImageEls[0]).toBeInTheDocument()

    expect(videoItemDetailsImageEls[0].src).toBe(websiteDarkThemeLogo)

    const homeLink = screen.getByRole('link', {
      hidden: true,
      name: /Home/i,
    })

    userEvent.click(homeLink)

    expect(window.location.pathname).toBe(homeRoutePath)
    const homeImageEls = await screen.findAllByRole('img', {
      name: /website logo/i,
    })
    expect(homeImageEls[0]).toBeInTheDocument()

    expect(homeImageEls[0].src).toBe(websiteDarkThemeLogo)
    restoreGetCookieFns()
  })

  it('When the Home link in the Sidebar is clicked, then the page should be navigated to the Home Route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const homeLink = screen.getByRole('link', {
      hidden: true,
      name: /Home/i,
    })
    userEvent.click(homeLink)

    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  it('When the Trending link in the Sidebar is clicked, then the page should be navigated to the Trending Route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const trendingBtn = screen.getByRole('link', {
      hidden: true,
      name: /Trending/i,
    })
    userEvent.click(trendingBtn)

    expect(window.location.pathname).toBe(trendingRoutePath)
    restoreGetCookieFns()
  })

  it('When the Gaming link in the Sidebar is clicked, then the page should be navigated to the Gaming Route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const gamingBtn = screen.getByRole('link', {
      hidden: true,
      name: /Gaming/i,
    })
    userEvent.click(gamingBtn)

    expect(window.location.pathname).toBe(gamingRoutePath)
    restoreGetCookieFns()
  })

  it('When the "Saved videos" link in the Sidebar is clicked, then the page should be navigated to the Saved Videos Route:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const savedVideosBtn = screen.getByRole('link', {
      hidden: true,
      name: /Saved Videos/i,
    })
    userEvent.click(savedVideosBtn)
    expect(window.location.pathname).toBe(savedVideosRoutePath)
    restoreGetCookieFns()
  })

  it('When the Save button in the Video Item Details Route is clicked, then its text content should change to "Saved":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const saveBtn = await screen.findByRole('button', {
      name: /Save/i,
    })

    userEvent.click(saveBtn)

    expect(
      screen.getByRole('button', {
        name: /Saved/i,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('When the Save button in the Video Item Details Route is clicked, then its text content should change to "Saved" with font color as "#2563eb":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const saveBtn = await screen.findByRole('button', {
      name: /Save/i,
    })

    userEvent.click(saveBtn)
    expect(
      screen.getByRole('button', {
        name: /Saved/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Saved$/i)).toHaveStyle('color: #2563eb')
    restoreGetCookieFns()
  })

  it('When the Saved button in the Video Item Details Route is clicked, then its text content should change to "Save" with font color as "#64748b":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const saveBtn = await screen.findByRole('button', {
      name: /Save/i,
    })

    userEvent.click(saveBtn)

    userEvent.click(
      screen.getByRole('button', {
        name: /Saved/i,
      }),
    )
    expect(screen.getByText(/Save$/i)).toHaveStyle('color: #64748b')

    restoreGetCookieFns()
  })
})
