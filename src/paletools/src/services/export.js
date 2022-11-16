export function exportCsv(headers, recordSet, filename) {
    return exportData(
        recordSet,
        null,
        record => `${headers.join(',')}\n`,
        record => `${record.join(',')}\n`,
        null,
        filename,
        'text/csv;encoding:utf-8');
}

export function exportHtml(headers, recordSet, filename) {
    return exportData(
        recordSet,
        () => '<table>',
        record => {
            let output = '<tr>';
            for (let field of headers) {
                output += `<th>${field}</th>`
            }
            output += '</tr>';
            return output;
        },
        record => {
            let output = '<tr>';
            for (let field of record) {
                output += `<td>${field}</td>`
            }
            output += '</tr>';
            return output;
        },
        () => '</table>',
        filename,
        'text/html;encoding:utf-8');
}


function exportData(recordSet, startRenderer, headerRenderer, dataRenderer, endRenderer, filename, mimeType) {
    return new Promise((resolve) => {
        let csvContent = '';

        csvContent += startRenderer ? startRenderer() : '';
        csvContent += headerRenderer();

        for(let row of recordSet){
            csvContent += dataRenderer(row);
        }

        csvContent += endRenderer ? endRenderer() : '';

        // The download function takes a CSV string, the filename and mimeType as parameters
        // Scroll/look down at the bottom of this snippet to see how download is called
        const download = function (content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';

            if (navigator.msSaveBlob) { // IE10
                navigator.msSaveBlob(new Blob([content], {
                    type: mimeType
                }), fileName);
            } else if (URL && 'download' in a) { //html5 A[download]
                a.href = URL.createObjectURL(new Blob([content], {
                    type: mimeType
                }));
                a.setAttribute('download', fileName);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
            }
            resolve();
        }

        download(csvContent, filename, mimeType);
    });
}
/// #endif