class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs) {
        const input = inputs[0]
        if (input.length > 0) {
            const channelData = input[0]
            this.port.postMessage(channelData)
        }
        return true
    }
}

registerProcessor('audio-processor', AudioProcessor)
