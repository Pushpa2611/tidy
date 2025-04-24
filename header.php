<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php wp_title(); ?></title>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<header>
    <img src="<?php echo esc_url($logo_url); ?>" alt="Logo">
    <nav>
        <?php
        wp_nav_menu([
            'theme_location' => $menu_slug,
        ]);
        ?>
    </nav>
</header>
