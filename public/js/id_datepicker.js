$(function () {
        $('.datepicker_input').datepicker({
            format: "dd/mm/yyyy",
            language: 'es',
            autoclose: true,
            todayHighlight: true
        }).on('changeDate',(e)=>{
            this.calcularEdad(e.Date)
        })
});

