function deleteSupply(id){
	$.ajax({
		url: "/supplies/" + id,
		type: "DELETE",
		success: function(result){
			window.location.reload(true);
		}
	})
};