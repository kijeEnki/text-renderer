const fonts = {
    "sitelen pona fonts": null,
    "sitelen seli kiwen": "url(fonts/sitelenselikiwenmonoasuki.ttf)",
    "fonts by sil": null,
    "andika": "url(fonts/Andika-Regular.ttf)",
    "charis sil": "url(fonts/CharisSIL-Regular.ttf)",
    "doulos sil": "url(fonts/DoulosSIL-Regular.ttf)",
    "miscellaneous": null,
    "system font stack": 'local(-apple-system), local(BlinkMacSystemFont), local("Segoe UI"), local(Roboto), local("Helvetica Neue"), local(Arial), local("Noto Sans"), local("Liberation Sans"), local(sans-serif), local("Apple Color Emoji"), local("Segoe UI Emoji"), local("Segoe UI Symbol"), local("Noto Color Emoji")'
}

function drawtext() {
    const text = $("#text").val();
    const font = $("#font").val();
    const fg = $("#fg").val();
    const bg = $("#bg").val();
    const size = parseInt($("#size").val()) > 0 ? parseInt($("#size").val()) : 48;
    const pad = parseInt($("#pad").val()) >= 0 ? parseInt($("#pad").val()) : 10;
    const spacing = parseFloat($("#spacing").val()) >= 0 ? parseFloat($("#spacing").val()) + 1.0 : 1.1;
    const align = $("#align").val();
    const metricsMode = $("#metricsMode").val();

    const hidden = $("#results");

    const canvas = $("#canvas")[0];
    const ctx = canvas.getContext("2d");

    const image = $("#image")[0];
    let renderButton = $("#render");

    renderButton.prop("disabled", true);
    renderButton.html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        rendering…`
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.fonts.load(`${size}px '${font}'`, text).then(() => {
        ctx.font = `${size}px '${font}'`;

        const lines = text.split("\n");
        const metricsList = lines.map(line => ctx.measureText(line));

        let maxAscent;
        let maxDescent;

        if (metricsMode === "font") {
            maxAscent = Math.max(...metricsList.map(m => m.fontBoundingBoxAscent));
            maxDescent = Math.max(...metricsList.map(m => m.fontBoundingBoxDescent));
        } else if (metricsMode === "actual") {
            maxAscent = Math.max(...metricsList.map(m => m.actualBoundingBoxAscent));
            maxDescent = Math.max(...metricsList.map(m => m.actualBoundingBoxDescent));
        }

        const lineHeight = (maxAscent + maxDescent) * spacing;

        const maxWidth = Math.max(...metricsList.map(m => m.width));

        canvas.width = Math.ceil(maxWidth + 2 * pad);
        canvas.height = Math.ceil(lines.length * lineHeight + 2 * pad);

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${size}px '${font}'`;
        ctx.fillStyle = fg;

        lines.forEach((line, i) => {
            const y = pad + maxAscent + i * lineHeight;
            if (align === "left") {
                ctx.textAlign = "left";
                ctx.fillText(line, pad, y);
            } else if (align === "center") {
                ctx.textAlign = "center";
                ctx.fillText(line, canvas.width / 2, y);
            } else if (align === "right") {
                ctx.textAlign = "right";
                ctx.fillText(line, canvas.width - pad, y);
            }
        })

        renderButton.prop("disabled", false);
        renderButton.html("render!");

        image.src = canvas.toDataURL("image/png");
        hidden.removeClass("d-none");
    })
}

function managefonts() {
    $("#font").empty();
    let css = ""
    for (const font in fonts) {
        if (fonts[font] === null) {
            $("#font").append(
                `<option disabled>        ${font}        </option>`
            )
        } else {
            $("#font").append(
                `<option value="${font}">${font}</option>`
            )
            css += `@font-face { font-family: "${font}"; src: ${fonts[font]}; }\n`;
        }
    }
    $("#style").text(css);
}

function applyfuncs() {
    managefonts()
    $("#render").click(drawtext);
}

$(document).ready(applyfuncs);