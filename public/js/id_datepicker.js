$(function () {
        $('.datepicker_input').datepicker({
            format: "dd/mm/yyyy",
            language: 'es',
            autoclose: true,
            todayHighlight: true
        })
});

/*
function insertarFila(){
    let phoneTable = document.getElementById('phoneTable');
    let row = phoneTable.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.innerHTML = "1";
    cell2.innerHTML = document.getElementById('telfPaciente').value;
    cell3.innerHTML = document.getElementById('telfDes').value;
    cell4.innerHTML = '<td><input class="btn btn-danger" type="button" value="Eliminar" onclick="deleteRow(this)"></td>'
}

function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("phoneTable").deleteRow(i);
}
*/