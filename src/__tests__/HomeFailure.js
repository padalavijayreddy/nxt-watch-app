import 'jest-styled-components'
import {BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

const errorView =
  'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'

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

const renderWithBrowserRouter = (ui = <App />, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

const videosResponse = {
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
      published_at: 'Aug 21, 2021',
      thumbnail_url:
        'https://i.ytimg.com/an_webp/tQ80uAyqVyI/mqdefault_6s.webp?du=3000&sqp=CMD7gokG&rs=AOn4CLD9MJWdZK3yZQN8pwi7S8DAWF9bQQ',
      title: 'JSX Concepts in Hooks',
      view_count: '256K',
    },
  ],
}

const homeVideosApiUrl = 'https://apis.ccbp.in/videos/all'

const homeVideosApiUrlWithSearchParameter =
  'https://apis.ccbp.in/videos/all?search='

const handlers = [
  rest.get(homeVideosApiUrl, (req, res, ctx) => res(ctx.json(videosResponse))),
]

const server = setupServer(...handlers)

const originalConsoleError = console.error
const originalFetch = window.fetch

describe('Home Route Failure tests', () => {
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

  it('When the HTTP GET request made in the Home Route is unsuccessful, then the page should consist of an HTML image element with alt attribute value as "failure view" and src as the given failure view image URL:::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(homeVideosApiUrl, (req, res, ctx) =>
        res(
          ctx.status(400),
          ctx.json({message: 'Authorization Header is undefined'}),
        ),
      ),
    )
    renderWithBrowserRouter()
    const imageEl = await screen.findByRole('img', {
      name: /failure view/i,
    })
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.src).toBe(errorView)
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made in the Home Route is unsuccessful, then the page should consist of an HTML main heading element with text content as "Oops! Something Went Wrong":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(homeVideosApiUrl, (req, res, ctx) =>
        res(
          ctx.status(400),
          ctx.json({message: 'Authorization Header is undefined'}),
        ),
      ),
    )
    renderWithBrowserRouter()
    const imageEl = await screen.findByRole('heading', {
      name: /Oops*. Something Went Wrong/i,
    })
    expect(imageEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made in the Home Route is unsuccessful, then the page should consist of an HTML paragraph element with text content starting with "We are having some trouble":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(homeVideosApiUrl, (req, res, ctx) =>
        res(
          ctx.status(400),
          ctx.json({message: 'Authorization Header is undefined'}),
        ),
      ),
    )
    renderWithBrowserRouter()

    const paragraphEl = await screen.findByText(/We are having some trouble/i)
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made in the Home Route is unsuccessful, then the page should consist of an HTML button element with text content as "Retry":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(homeVideosApiUrl, (req, res, ctx) =>
        res(
          ctx.status(400),
          ctx.json({message: 'Authorization Header is undefined'}),
        ),
      ),
    )

    renderWithBrowserRouter()
    const buttonEl = await screen.findByRole('button', {
      name: /Retry/i,
    })

    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made in the Home Route is unsuccessful and the Retry button is clicked, then an HTTP GET request should be made to the given Home Videos API URL:::5:::', async () => {
    mockGetCookie()
    const mockFetchFunction = jest.fn().mockImplementation(() => ({
      ok: false,
      json: () => Promise.resolve({}),
    }))
    window.fetch = mockFetchFunction
    renderWithBrowserRouter()
    const buttonEl = await screen.findByRole('button', {
      name: /Retry/i,
    })
    expect(buttonEl).toBeInTheDocument()
    userEvent.click(buttonEl)
    expect(mockFetchFunction.mock.calls[1][0]).toBe(
      `${homeVideosApiUrlWithSearchParameter}`,
    )
    restoreGetCookieFns()
  })

  // #endregion
})
