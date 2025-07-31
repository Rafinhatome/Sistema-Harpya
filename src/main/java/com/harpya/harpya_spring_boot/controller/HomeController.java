package com.harpya.harpya_spring_boot.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class HomeController {
	
	@GetMapping("/")
	public String helloWord() {
		return "Hello World";
	}

}
