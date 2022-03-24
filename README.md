# jbmyo.xyz

This is the code for my personal website, which is available on [jbmyo.xyz](https://pip.pypa.io/en/stable/). This website is a work in project, but the idea is to put some personnal projects on it. For now, only my latest project is on it.


## About the visualizer

Sound is a signal: amplitude domain or frequency domain.
We will look at the audio file (at each time t) in the frequency domain using Fourier transorm and map every frequency to a visual object. The possibilities are endless so I made a choice.
I need to find a good frequency interval (spectrum): between 1 Hz and 1500 Hz might be good for music. (We'll tune this, or make it tunable). Some filtering/smoothing will probably make it look nicer.
My intuitive choice for this project was Python, and I found some existing projects online. But after some thought, I decided to pursue this porject using JavaScript, as I wanted to gain experience with the language and deploy it online. I used the [p5.js](https://p5js.org) library.

Some videos that helped me for this project: 

[The Coding Train - Sound Visualization: Frequency Analysis with FFT](https://www.youtube.com/watch?v=2O3nm0Nvbi4)

[Max Mitchell - Creating a JavaScript Music Visualizer (with p5.js and React)](https://www.youtube.com/watch?v=_yXQayoxJOg)
