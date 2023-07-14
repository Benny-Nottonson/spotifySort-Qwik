# Spotify Sort - TS

[![License](https://img.shields.io/github/license/benny-nottonson/spotifySort-Qwik)](https://github.com/Benny-Nottonson/spotifySort-Qwik/blob/main/LICENSE)
[![Version](https://img.shields.io/github/v/release/benny-nottonson/spotifySort-Qwik)](https://github.com/Benny-Nottonson/spotifySort-Qwik/releases)
[![Issues](https://img.shields.io/github/issues/benny-nottonson/spotifySort-Qwik)](https://github.com/Benny-Nottonson/spotifySort-Qwik/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Benny-Nottonson/spotifySort-Qwik/pulls)

Spotify Sort - TS is a project written in TypeScript using the Qwik framework. It is a new version of an old project that was originally coded in NextJS/ThreeJS. This new version aims to improve the performance and maintainability of the project by leveraging the features of the Qwik framework. The website provides a fast and efficient way to sort Spotify albums based on the color of their album art.

## Features

- Sorting Spotify albums by the color of their album art
- Utilizes CCV's, caching, and multithreading for efficient sorting
- Built on top of the research paper "Comparing Images Using Color Coherence Vectors" by Greg Pass, Ramin Zabih, and Justin Miller from Cornell University

## About

This project is built on top of the research paper titled "Comparing Images Using Color Coherence Vectors" by Greg Pass, Ramin Zabih, and Justin Miller from Cornell University. The paper introduces a method for comparing images based on color histograms and spatial information. It addresses the limitations of color histograms by incorporating spatial information using color coherence vectors (CCV). The CCV approach provides finer distinctions and superior results compared to color histograms for image retrieval.

## Project Details

- **Repository**: [https://github.com/Benny-Nottonson/spotifySort-Qwik](https://github.com/Benny-Nottonson/spotifySort-Qwik)
- **Author**: [benny-nottonson](https://github.com/benny-nottonson)

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Benny-Nottonson/spotifySort-Qwik.git
   ```

2. Install the dependencies:

   ```bash
   cd spotifySort-Qwik
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the project in action.

## Contributing

Contributions to this project are welcome! If you encounter any issues or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/Benny-Nottonson/spotifySort-Qwik/issues). Pull requests are also appreciated.

## License

This project is licensed under the [MIT License](https://github.com/Benny-Nottonson/spotifySort-Qwik/blob/main/LICENSE).
