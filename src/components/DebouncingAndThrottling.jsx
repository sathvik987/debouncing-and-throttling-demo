import React, { Component } from 'react';
import "./1.css"

class DebouncingAndThrottling extends Component {
    constructor() {
        super()
        this.state = {
            default: "",
            defaultCount: 0,
            debounce: "",
            debounceCount: 0,
            throttle: "",
            throttleCount: 0
        }
    }
    updateText = async (event) => {
        // Added pause to get correct event.target.value
        await this.pause(500)
        let text = event.target.value
        this.default(text)
        this.debounceCall(text)
        this.throttleCall(text)
    }

    default = async (text) => {
        if (text) {
            try {
                let res = JSON.stringify(await (await fetch('https://dummyjson.com/products/search?q=' + text)).json())
                this.setState({ default: res, defaultCount: this.state.defaultCount + 1 })
            } catch (error) {
                console.log(error);
            }
        } else {
            this.setState({ default: "", defaultCount: 0 })
        }
    }


    debounce = (cb, delay = 500) => {
        let timeout = null

        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }

    debounceCall = this.debounce(async (text) => {
        if (text) {
            try {
                let res = JSON.stringify(await (await fetch('https://dummyjson.com/products/search?q=' + text)).json())
                this.setState({ debounce: res, debounceCount: this.state.debounceCount + 1 })
            } catch (error) {
                console.log(error);
            }
        } else {
            this.setState({ debounce: "", debounceCount: 0 })
        }
    })

    throttle = (cb, delay = 500) => {
        let shouldWait = false
        let waitingArgs = null
        const timeoutFunc = () => {
            if (waitingArgs) {
                cb(...waitingArgs)
                waitingArgs = null
                setTimeout(timeoutFunc, delay);
            } else {
                shouldWait = false
            }
        }

        return (...args) => {
            if (shouldWait) {
                waitingArgs = args
                return
            }

            cb(...args)
            shouldWait = true
            setTimeout(timeoutFunc, delay)
        }
    }

    throttleCall = this.throttle(async (text) => {
        if (text) {
            try {
                let res = JSON.stringify(await (await fetch('https://dummyjson.com/products/search?q=' + text)).json())
                this.setState({ throttle: res, throttleCount: this.state.throttleCount + 1 })
            } catch (error) {
                console.log(error);
            }
        } else {
            this.setState({ throttle: "", throttleCount: 0 })
        }
    })

    pause = (time) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

    render() {
        return (
            <div style={{ paddingTop: '1em', display: 'flex', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <input type="text" placeholder='Search' style={{ height: '3em', width: '35em' }} onChange={this.updateText} />
                    <div style={{ textAlign: 'left' }}>
                        <h3>Default: (Api call count - {this.state.defaultCount})</h3> <span style={{ marginLeft: '0.8em' }} className='response'> {this.state.default} </span>
                        <h3>Debounce: (Api call count -  {this.state.debounceCount})</h3> <span style={{ marginLeft: '0.8em' }} className='response'> {this.state.debounce} </span>
                        <h3>Throttle: (Api call count -  {this.state.throttleCount})</h3> <span style={{ marginLeft: '0.8em' }} className='response'>  {this.state.throttle}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default DebouncingAndThrottling;