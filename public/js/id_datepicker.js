// Esperamos a que el DOM esté completamente cargado
$(document).ready(function() {
  
    // Inicializar el datepicker
    $('.datepicker_input').datepicker({
      format: 'dd/mm/yyyy',      // Definimos el formato de la fecha
      autoclose: true,           // Cierra el datepicker después de seleccionar
      todayHighlight: true,      // Resaltar el día actual
      language: 'es'             // Idioma español
    }).on('changeDate', function(e) {
      // Obtener la fecha seleccionada
      const selectedDate = e.format('dd/mm/yyyy');
      console.log('Fecha seleccionada:', selectedDate);
  
      // Calcular la edad
      const edad = calcularEdad(selectedDate);
      
      // Mostrar la edad en el elemento HTML
      //document.getElementById('edadCalculada').value = `${edad} años`;
      document.getElementById('edadCalculada').value = `${edad.years} años, ${edad.months} meses, y ${edad.days} días`;

      //borrar errores
      window.clearFechaNacimientoError();
    });
  
    // Función para calcular la edad
    function calcularEdad(fechaNacimiento) {
      // Dividimos la fecha en partes (día, mes, año)
      const [day, month, year] = fechaNacimiento.split('/').map(Number);
  
      // Crear una fecha a partir de la fecha de nacimiento
      const birthDate = new Date(year, month - 1, day);  // Meses en JavaScript van de 0 a 11
  
      // Obtener la fecha actual
      const today = new Date();
  
      // Calcular la diferencia de años
      let years  = today.getFullYear() - birthDate.getFullYear();
  
        // Calcular la diferencia en meses
        let months = today.getMonth() - birthDate.getMonth();
        if (months < 0) {
        months += 12;
        years--;  // Restar un año si aún no ha pasado el cumpleaños
        }

        // Calcular la diferencia en días
        let days = today.getDate() - birthDate.getDate();
        if (days < 0) {
        // Ajustar el mes si no ha pasado el día del cumpleaños
        months--;
        if (months < 0) {
            months += 12;
            years--;
        }
      
        // Obtener la cantidad de días en el mes anterior
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
           days += lastMonth.getDate();  // Sumamos los días del mes anterior
        }

    return { years, months, days };
    }
  });
  