import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import axios from "axios";
import { UserData } from "../types/userData";
import userEvent from "@testing-library/user-event";

const mockedUserData: UserData = {
  country: "US",
  display_name: "Mock User",
  email: "mockuser@email.com",
  explicit_content: {
    filter_enabled: false,
    filter_locked: false,
  },
  external_urls: {
    spotify: "mock_external_url",
  },
  followers: {
    href: "mock_followers_href",
    total: 10,
  },
  href: "mock_href",
  id: "mock_id",
  images: [
    {
      height: 50,
      url: "mock_image_url_1",
      width: 50,
    },
    {
      height: 100,
      url: "mock_image_url_2",
      width: 100,
    },
  ],
  product: "mock_product",
  type: "mock_type",
  uri: "mock_uri",
};

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.resetAllMocks();
    // Reset location, in case of parallel testing with login redirect
    delete (window as any).location;
    (window as any).location = { ...originalLocation, assign: jest.fn() };
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation as any;
  });

  test("Show blank page when attempting to load user data", async () => {
    mockedAxios.get.mockReturnValueOnce(new Promise(() => {}));
    render(<App />);
    expect(screen.queryByText(/playlist comparison/i)).not.toBeInTheDocument();
  });

  test("Render main content if user is authorized and logged in", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockedUserData });
    render(<App />);
    await waitFor(() =>
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:8080/api/user",
        { withCredentials: true }
      )
    );
    const userImage = await screen.findByAltText(/Mock User Profile/i);
    expect(userImage).toBeInTheDocument();
    expect(userImage).toHaveAttribute("src", mockedUserData.images[0].url);
  });

  test("Render login screen if user is currently unauthorized", async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/playlist comparison/i)).toBeInTheDocument()
    );
    expect(
      screen.getByRole("button", { name: /sign in with spotify/i })
    ).toBeInTheDocument();
  });

  test("Login button redirects to Spotify OAuth endpoint", async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: { status: 401 },
    });

    let redirectedTo = "";
    delete (window as any).location;
    (window as any).location = {
      get href() {
        return redirectedTo;
      },
      set href(value: string) {
        redirectedTo = value;
      },
    };

    render(<App />);
    const loginBtn = await screen.findByRole("button", {
      name: /sign in with spotify/i,
    });

    userEvent.click(loginBtn);

    expect(redirectedTo).toBe("http://localhost:8080/login");
  });
});
