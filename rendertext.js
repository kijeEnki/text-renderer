const fonts = {
    "sitelen pona fonts": null,
    "sitelen seli kiwen": "url(fonts/sitelenselikiwenmonoasuki.ttf)",
    "fonts by sil": null,
    "andika": "url(fonts/Andika-Regular.ttf)",
    "charis sil": "url(fonts/CharisSIL-Regular.ttf)",
    "doulos sil": "url(fonts/DoulosSIL-Regular.ttf)",
    "miscellaneous": null,
    "system font": 'local(-apple-system), local(BlinkMacSystemFont), local("Segoe UI"), local(Roboto), local("Helvetica Neue"), local(Arial), local("Noto Sans"), local("Liberation Sans"), local(sans-serif), local("Apple Color Emoji"), local("Segoe UI Emoji"), local("Segoe UI Symbol"), local("Noto Color Emoji")'
}

function drawtext() {
    let text = $("#text").val();
    let fg = $("#fg").val();
    let renderButton = $("#render");

    const canvas = $("#canvas")[0];
    const ctx = canvas.getContext("2d");

    const font = $("#font").val();
    const size = $("#size").val();

    renderButton.prop("disabled", true);
    renderButton.html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        rendering…`
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.fonts.load(`${size}px '${font}'`, text).then(() => {
        ctx.font = `${size}px '${font}'`;
        ctx.fillStyle = fg;

        const lines = text.split("\n");
        const metricsList = lines.map(line => ctx.measureText(line));

        const maxAscent = Math.max(...metricsList.map(m => m.fontBoundingBoxAscent));
        const maxDescent = Math.max(...metricsList.map(m => m.fontBoundingBoxDescent));
        const lineHeight = (maxAscent + maxDescent) * 1.1;

        const maxWidth = Math.max(...metricsList.map(m => m.width));

        canvas.width = Math.ceil(maxWidth + 20);
        canvas.height = Math.ceil(lines.length * lineHeight + 20);

        ctx.font = `${size}px '${font}'`;
        ctx.fillStyle = fg;

        lines.forEach((line, i) => {
            const y = 10 + maxAscent + i * lineHeight;
            ctx.fillText(line, 10, y);
        })

        renderButton.prop("disabled", false);
        renderButton.html("render!");
    })

    console.log(text);

}

function managefonts() {
    $("#font").empty();
    let css = ""
    for (const font in fonts) {
        if (fonts[font] === null) {
            $("#font").append(
                `<option disabled>        ${font}</option>`
            )
        } else {
            $("#font").append(
                `<option value="${font}">${font}</option>`
            )
        }
        css += `@font-face { font-family: "${font}"; src: ${fonts[font]}; }\n`;
    }
    $("#style").text(css);
}

function applyfuncs() {
    managefonts()
    $("#render").click(drawtext);
}

$(document).ready(applyfuncs);