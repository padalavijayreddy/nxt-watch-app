import 'jest-styled-components'
import {BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {formatDistanceStrict} from 'date-fns'

import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

const websiteLogo =
  'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'
const profilePicImage =
  'https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png'
const facebookLogo =
  'https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png'
const twitterLogo =
  'https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png'
const linkedInLogo =
  'https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png'

const loginRoutePath = '/login'
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

describe('Video Item Details Route UI tests', () => {
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

  it('When "/videos/:id" is provided as the URL path by an unauthenticated user, then the page should be navigated to the Login Route:::5:::', () => {
    mockGetCookie(false)
    renderWithBrowserRouter()
    expect(window.location.pathname).toBe(loginRoutePath)
    restoreGetCookieFns()
  })

  it('When "/videos/:id" is provided as the URL path by an authenticated user, then the page should be navigated to the Video Item Details Route and should consist of an HTML paragraph element with text content as the value of the key "title" received from the video details response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    expect(window.location.pathname).toBe(videoItemDetailRoutePath)
    expect(
      await screen.findByText(videoDetailsResponse.video_details.title, {
        exact: false,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML image element in the Header with alt attribute value as "website logo" and src as the given logo URL:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const imageEls = await screen.findAllByRole('img', {
      name: /website logo/i,
    })

    expect(imageEls[0]).toBeInTheDocument()
    expect(imageEls[0].src).toBe(websiteLogo)
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML image element in the Header with alt attribute value as "website logo" and src as the given logo URL, wrapped with Link from react-router-dom:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const websiteLogos = await screen.findAllByRole('link', {
      name: /website logo/,
    })

    expect(websiteLogos[0]).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML button element with data-testid attribute value as "theme" in the Header:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const themeButtons = await screen.findAllByTestId('theme')

    expect(themeButtons[0]).toBeInTheDocument()
    expect(themeButtons[0].tagName).toBe('BUTTON')
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML image element in the Header with alt attribute value as "profile" and src as the given profile image URL:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const imageEl = await screen.findByRole('img', {
      hidden: true,
      name: /profile/i,
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.src).toBe(profilePicImage)
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML button element with text content as "Logout" in the Header:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    expect(
      await screen.findByRole('button', {
        hidden: true,
        name: /Logout/i,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of a Link from react-router-dom with text content as "Home":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    expect(
      await screen.findByRole('link', {
        hidden: true,
        name: /Home/i,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of a Link from react-router-dom with text content as "Trending":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    expect(
      await screen.findByRole('link', {
        hidden: true,
        name: /Trending/i,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of a Link from react-router-dom with text content as "Gaming":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    expect(
      await screen.findByRole('link', {
        hidden: true,
        name: /Gaming/i,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of a Link from react-router-dom with text content as "Saved videos":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    expect(
      await screen.findByRole('link', {
        hidden: true,
        name: /Saved videos/i,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML paragraph element with text content as "CONTACT US" in the Sidebar:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const paragraphEl = await screen.findByText(/CONTACT US/i, {
      hidden: true,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML image element with alt attribute value as "facebook logo" and src as the given Facebook logo URL:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const imageEl = await screen.findByRole('img', {
      hidden: true,
      name: /facebook logo/i,
    })
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.src).toBe(facebookLogo)
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML image element with alt attribute value as "twitter logo" and src as the given Twitter logo URL:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const imageEl = await screen.findByRole('img', {
      hidden: true,
      name: /twitter logo/i,
    })
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.src).toBe(twitterLogo)
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML image element with alt attribute value as "linkedin logo" and src as the given LinkedIn logo URL:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const imageEl = await screen.findByRole('img', {
      hidden: true,
      name: /linkedin logo/i,
    })
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.src).toBe(linkedInLogo)
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML paragraph element with text content as "Enjoy! Now you can see your recommendations!" in the Sidebar:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const paragraphEl = await screen.findByText(
      /Enjoy*. Now you can see your recommendations/i,
      {
        hidden: true,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it('When the Video Item Details Route is opened, it should initially consist of an HTML container element with testid attribute value as "loader":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()
    await waitForElementToBeRemoved(() => screen.queryByTestId('loader'))

    restoreGetCookieFns()
  })

  it('When the Video Item Details Route is opened, an HTTP GET request should be made to the given Video Details API URL with the video id as a path parameter:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(() => ({
      ok: true,
      json: () => Promise.resolve(videoDetailsResponse),
    }))
    window.fetch = mockFetchFunction
    renderWithBrowserRouter()

    expect(mockFetchFunction.mock.calls[0][0]).toMatch(videoDetailsApiUrl)
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Video Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "title" received from the video details response:::5:::', async () => {
    mockGetCookie()

    renderWithBrowserRouter()

    const paragraphEl = await screen.findByText(
      videoDetailsResponse.video_details.title,
      {
        exact: false,
      },
    )

    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Video Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "view_count" received from the video details response:::5:::', async () => {
    mockGetCookie()

    renderWithBrowserRouter()

    const paragraphEl = await screen.findByText(
      videoDetailsResponse.video_details.view_count,
      {
        exact: false,
      },
    )

    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Video Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "published_at" received from the video details response:::5:::', async () => {
    mockGetCookie()

    const dateFormatDistance = dateString => {
      const formatDistanceDate = formatDistanceStrict(
        new Date(dateString),
        new Date(),
      )
      return formatDistanceDate
    }

    const date1 = 'Oct 7, 2019'

    const formattedDate1 = dateFormatDistance(date1)

    renderWithBrowserRouter()
    const paragraphEl = await screen.findByText(
      new RegExp(`${date1}|${formattedDate1}`),
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML button element with text content as "Like":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    expect(
      await screen.findByRole('button', {
        name: /^Like/i,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML button element with text content as "Dislike":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()
    expect(
      await screen.findByRole('button', {
        name: /Dislike/i,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('Video Item Details Route should consist of an HTML button element with text content as "Save":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()
    expect(
      await screen.findByRole('button', {
        name: /Save/i,
      }),
    ).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Video Item Details Route is successful, then the page should consist of HTML image elements with alt attribute value as "channel logo" and src equal to the value of the key "profile_image_url" in the channel details received from the video details response:::5:::', async () => {
    mockGetCookie()

    renderWithBrowserRouter()

    const imageEls = await screen.findAllByRole('img', {
      hidden: true,
      name: /channel logo/i,
    })
    expect(imageEls[0]).toBeInTheDocument()
    expect(imageEls[0].src).toBe(
      videoDetailsResponse.video_details.channel.profile_image_url,
    )

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Video Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "name" in the channel details received from the video details response:::5:::', async () => {
    mockGetCookie()

    renderWithBrowserRouter()

    const paragraphEl = await screen.findByText(
      videoDetailsResponse.video_details.channel.name,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Video Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "subscriber_count" in the channel details received from the video details response:::5:::', async () => {
    mockGetCookie()

    renderWithBrowserRouter()

    const paragraphEl = await screen.findByText(
      videoDetailsResponse.video_details.channel.subscriber_count,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Video Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "description" received from the video details response:::5:::', async () => {
    mockGetCookie()

    renderWithBrowserRouter()

    const paragraphEl = await screen.findByText(
      videoDetailsResponse.video_details.description,
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the Like button is clicked, then the Like button should have the font color as "#2563eb":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const likeBtn = await screen.findByRole('button', {
      name: /^Like/i,
    })

    userEvent.click(likeBtn)
    expect(screen.getByText(/^Like/i)).toHaveStyle('color: #2563eb')
  })

  it('When the Dislike button is clicked, then the Dislike button should consist of the font color as "#2563eb":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const dislikeBtn = await screen.findByRole('button', {
      name: /Dislike/i,
    })

    userEvent.click(dislikeBtn)
    expect(screen.getByText(/^Dislike/i)).toHaveStyle('color: #2563eb')
  })

  it('When the Like button is active and the Dislike button is clicked, then the Dislike button should consist of the font color as "#2563eb" and the Like button should consist of the font color as "#64748b":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const likeBtn = await screen.findByRole('button', {
      name: /^Like/i,
    })

    userEvent.click(likeBtn)

    const dislikeBtn = screen.getByRole('button', {
      name: /Dislike/i,
    })

    userEvent.click(dislikeBtn)
    expect(screen.getByText(/^Dislike/i)).toHaveStyle('color: #2563eb')

    expect(screen.getByText(/^Like/i)).toHaveStyle('color: #64748b')
  })

  it('When the Dislike button is active and the Like button is clicked, then the Like button should consist of the font color as "#2563eb" and the DisLike button should consist of the font color as "#64748b":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()

    const dislikeBtn = await screen.findByRole('button', {
      name: /Dislike/i,
    })

    userEvent.click(dislikeBtn)

    const likeBtn = screen.getByRole('button', {
      name: /^Like/i,
    })

    userEvent.click(likeBtn)

    expect(screen.getByText(/^Like/i)).toHaveStyleRule(
      'color',
      expect.stringContaining('#2563eb'),
    )

    expect(screen.getByText(/^Dislike/i)).toHaveStyleRule(
      'color',
      expect.stringContaining('#64748b'),
    )
  })
})
